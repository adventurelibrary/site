import {
	Asset,
	AssetDownloadOptions,
	AssetDownloadResponse,
	AssetFormData,
	AssetSearchOptions,
	AssetSignatureResponse,
	AssetsResponse,
	AssetTag,
	AssetUpdate,
	AssetUploadResponse,
	AssetVisibility,
	SortDirection,
	UnlockAssetResponse
} from "./asset-types";
import {Ajax, newAjax} from "../../lib/ajax";
import {ActiveUpload} from "~/modules/assets/asset-uploads";
import api from "~/lib/api"
import {getTagById} from "~/modules/tags/tags-api";
import {AssetSearchFilter} from "~/modules/assets/search-filters";
import {newSearchOptions, SORT_DIR_DEFAULT, SORT_FIELD_DEFAULT} from "~/modules/assets/asset-helpers";
import {objectToQueryString} from "~/lib/helpers";


// These next two functions are called to ensure that our options have a sort direction, and will default to something
// if none has been set by the user
export function getSearchOptionsSortField (opts: AssetSearchOptions) : string {
	return opts.sortField || SORT_FIELD_DEFAULT
}
export function getSearchOptionsSortDirection (opts: AssetSearchOptions) : SortDirection {
	return opts.sortDirection || SORT_DIR_DEFAULT
}

// This function is used to create the object that our API expects to receive to search for assets
// It takes in the options, which are assembled by the user, and converts them into
// a format that our API expects
// The result of this function is converted into GET query params send with an API call
export const assetSearchOptionsToAPIQuery = (opts : AssetSearchOptions) : Record<string, string> => {
	const search = (opts.query || '').toLowerCase().trim()
	const filters = opts.filters
	const tags : string[] = []
	const categories : string[] = []
	const creatorSlugs : string[] = []

	filters.forEach((filter: AssetSearchFilter) => {
		if (filter.type === 'tag') {
			tags.push(filter.value)
			return
		}
		if (filter.type === 'category') {
			categories.push(filter.value)
			return
		}
		if (filter.type === 'creator') {
			creatorSlugs.push(filter.value)
			return
		}
	})
	const query : Record<string, string> = {}

	query.sort = getSearchOptionsSortField(opts)
	query.sort_direction = getSearchOptionsSortDirection(opts)

	if (search && search.length) {
		query.text = search
	}
	if (tags.length) {
		query.tags = tags.join(',')
	}
	if (categories.length) {
		query.categories = categories.join(',')
	}
	if (creatorSlugs.length) {
		query.creator_slugs = creatorSlugs.join(',')
	}

	let size = opts.size
	let from = opts.from
	if (size > 40 || isNaN(size) || size < 0) {
		size = 40
	}
	if (isNaN(from) || from < 0) {
		from = 0
	}
	query.size = size.toString()
	query.from = from.toString()

	return query
}

// Takes in a key:value map of parameters and uses them to
// make a request to our API for the assets that match those parameters
export async function queryAssets (opts: Record<string, string>) : Promise<AssetsResponse> {
	const url = '/assets?' + objectToQueryString(opts)

	const res = await api.get<AssetsResponse>(url)
	res.data.assets = res.data.assets.map(transformAsset)
	return res.data
}

// returns array of related assets of an asset by tags, excluding the original asset passed
export async function getRelatedAssetsByTags (asset: Asset) : Promise<AssetsResponse> {
	if (!asset.tags) {
		return {
			assets: [],
			total: 0
		}
	}
	const opts = {tags: asset.tags.join(',') };
	const res = await api.get<AssetsResponse>('/assets?' + objectToQueryString(opts))
	res.data.assets = res.data.assets.map(transformAsset)

	// remove passed Asset from results
	let n = 0;
	res.data.assets.forEach(e => {
		if (e.id == asset.id)
			res.data.assets.splice(n,1)
		n++;
	})

	return res.data
}


// This takes in the search options that our user has assembled, converts those optiosn
// into a format our API expects, and makes a request to our API for those assets
export const searchAssets = async (opts: AssetSearchOptions) : Promise<AssetsResponse> => {
	const apiQuery = assetSearchOptionsToAPIQuery(opts)
	return await queryAssets(apiQuery)
}

// This is to fetch all the assets you have access for, as a creator
export const getMyUnlockedAssets = async (search: AssetSearchOptions): Promise<AssetsResponse> => {
	const res = await api.get('/assets/unlocked')
	return res.data
}

// This is the search for our admin area
// It does all the same stuff as searchAssets AND it also
// specififes that we want to view ALL assets, not just the visible ones
export async function searchAdminAssets (opts: AssetSearchOptions) : Promise<AssetsResponse> {
	throw new Error(`Not implemented`)
}

// This function is used to cleanup any data that the server gives us
export function transformAsset (asset: Asset) : Asset {
	const newTags : AssetTag[] = []
	if (Array.isArray(asset.tags)) {
		asset.tags.forEach((t) => {
			const tag = getTagById(t)
			if (tag) {
				newTags.push(tag)
			}
		})
	}

	asset.tagObjects = newTags

	return asset
}

// Gets the signature for an ActiveUpload and then updates
// the active upload object with the signature and related data
export const signActiveUpload = async (au : ActiveUpload) => {
	const res = await createAssetSignature(au.creator_id, au.file.name, au.asset)
	au.signature = res.signature
	au.status = 'signed'
	au.params = res.params
}

// Gets a signature from our API that will be used when we send the file directly to transloadit
export const createAssetSignature = async (creatorId: string, filename: string, fields: AssetFormData) : Promise<AssetSignatureResponse> => {
	const data = assetFormDataToPayload(fields)
	const res = await api.post<AssetSignatureResponse>(`manage/creator/${creatorId}/upload-signature`, data)
	return res.data
}

// Makes the actual required to transloadit to send the file data
// This is done after getting a transloadit signature from our API
export const uploadAsset = async (file : File, signature: string, params: any) : Promise<AssetUploadResponse> => {
	const form = new FormData()
	form.append('file', file)
	form.append('params', params)
	form.append('signature', signature)
	const res = await api.request<AssetUploadResponse>({
		url: 'https://api2.transloadit.com/assemblies',
		method: 'post',
		headers: {

		},
		data: form
	})
	return res.data
}

// Gets the assets to show on the home page as featured
// For now it just does a search, since we don't have any featured functionality on the backend
export const getFeaturedAssets = async () : Promise<AssetsResponse> => {
	return searchAssets(newSearchOptions())
}

// This function queries the server for a single asset based on a single value
// This is used to get an asset by its ID or by its SLUG, for example
export async function getAssetByField(field: string, value: string) : Promise<Asset> {
	const res = await api.get<Asset>(`/assets?${field}=${value}`)
	return res.data
}

export const getAssetBySlug = async (slug: string) : Promise<Asset> => {
	const parts = slug.split('-')
	const id = parts[parts.length-1]
	const path = `/assets/${id}`
	const res = await api.get(path)
	return transformAsset(res.data)
	//return getAssetById(id)
}

// Queries for an asset, and does wraps the process in an Ajax object
// The Ajax part will add loading boolean, error string, and data interface
// data will hold the response from the api
export const getAssetAjax = async(slug: string) : Promise<Ajax<Asset>> => {
	const ajax = newAssetAjax()
	try {
		const asset = await getAssetBySlug(slug)
		ajax.data = asset
	} catch (ex) {
		ajax.error = ex.toString()
	}

	ajax.loading = false
	return ajax
}

export const getAssetAjaxById = async(id: string) : Promise<Ajax<Asset>> => {
	const ajax = newAssetAjax()
	try {
		const asset = await getAssetById(id)
		ajax.data = asset
	} catch (ex) {
		ajax.error = ex.toString()
	}

	ajax.loading = false
	return ajax
}

export const getAssetById = async (id: string) : Promise<Asset> => {
	const res = await api.get<Asset>('/assets/' + id) //await getAssetByField('id', id)
	const asset = transformAsset(res.data)
	return asset
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getAssetDownloadLink(id: string, options: AssetDownloadOptions) : Promise<string> {
	const res = await api.get<AssetDownloadResponse>(`/assets/${id}/download?type=original`)
	return res.data.url
}

// This endpoint on the server will grab all assets in the dynamo db
// and sync them up with elastic search
export async function syncAssets () {
	return await api.post('/database/sync')
}

// When a user wants to unlock an asset by spending their coins on it, so that they can download
// the asset
export async function unlockAsset (assetId: string) : Promise<UnlockAssetResponse> {
	const res = await api.post(`/assets/${assetId}/unlock`)
	return res.data
}

// This used when a user selects multiple assets and wants to mark them all as
// VISIBLE or HIDDEN
export async function updateAssetsVisibilities(ids: string[], vis: AssetVisibility) {
	const updates : AssetUpdate[] = ids.map((id) => {
		return {
			id: id,
			visibility: vis
		}
	})
	return await saveAssets(updates)
}

export const newAsset = () : Asset => {
	return {
		id: '',
		category: '',
		creator_id: '',
		creator_name: '',
		description: '',
		unlocked: false,
		unlock_price: 0,
		name: '',
		slug: '',
		tags: [],
		tagObjects: [],
		thumbnail: '',
		visibility: 'HIDDEN',
		upload_status: 'PENDING'
	}
}

// Creates a new Ajax object for a component that needs to load a list of assets
// The Ajax component adds functionality for 'loading' and 'error'
export const newAssetsAjax = () : Ajax<AssetsResponse> => {
	return newAjax<AssetsResponse>({
		assets: [],
		total: 0
	})
}

export const newAssetAjax = () : Ajax<Asset> => {
	return newAjax<Asset>(newAsset())
}

// Makes a request to our server to update one or more assets
export const saveAssets = async (payloads: AssetUpdate[]) => {
	return await api.put('/manage/assets/update', payloads)
}

export const saveAsset = async (id: string, data: AssetFormData) => {
	const pl = assetFormDataToPayload(data)
	pl.id = id
	return saveAssets([pl])
}

// This function is used to take what the server gives us for an asset,
// and convert it into the data format that our forms use
// For example if the server returns {creator: {id: '123', name: 'Jill'}...}
// we might want our form data to have {creatorId: '123'}. The form doesn't care
// about the name of the creator, just its id
export const assetToFormData = (asset: Asset) : AssetFormData => {
	return Object.assign({}, asset)
}

// Takes the form data that our components works with, and converts
// it into a format that our API expects
export const assetFormDataToPayload = (data: AssetFormData) : any => {
	const payload : any = {}
	payload.name = data.name
	payload.creator_id = data.creator_id
	payload.visibility = data.visibility
	payload.description = data.description
	payload.category = data.category
	//payload.tagIDs = tagListToMap(data.tags)
	if (data.tagObjects) {
		payload.tags = data.tagObjects.map((t) => {
			return t.label
		})
	} else {
		payload.tags = []
	}
	payload.unlock_price = 0
	payload.revenue_share = {}
	return payload
}

// Will hard delete if nobody has bought this asset, otherwise it will
// archive it
// The 'result' prop that is returned will be "deleted" or "hidden"
export async function archiveAsset (assetId: string) {
	const res = await api.post(`/manage/assets/${assetId}/delete`)
	return res.data.result
	/*console.log("asset-api.ts: API archiveAsset called for asset id: ", assetId)

	// update asset visible to hidden
	await api.put('/assets/update', [{id: assetId, visibility: 'HIDDEN'}])*/
}

// recieves reports of assets, sends report to Notion
export async function reportAsset (assetId: string, assetName: string, reportCategory: string, submitterName: string, submitterEmail: string, message: string) {
	console.log("asset-api.ts: API reportAsset called for asset id: ", assetId)

	// call Notion API to register report, Notion automation task can then be set to send emails to moderators if needed
	// Notion API: https://developers.notion.com/
	// Notion Block API: https://developers.notion.com/reference/block
	/*
		Sent info:

		assetId
		assetName
		name
		email
		message
	*/

	// create JSON --data object to send to Notion
	let JSONobject = {
		"children": [
			{
				"object": "block",
				"type": "heading_2",
				"heading_2": {
					"text": [{ "type": "text", "text": { "content": "Report: " + assetName + " (ID: " + assetId + ")" } }]
				}
			},
			{
				"object": "block",
				"type": "paragraph",
				"paragraph": {
					"text": [
						{
							"type": "text",
							"text": {
								"content": "Report Category: " + reportCategory + " | Reported By: " + submitterName + " | Email: " + submitterEmail + " | Message: " + message,
								"link": { "url": "http://localhost:2000/asset/" + "generatedassetlinkslug" }
							}
						}
					]
				}
			}
		]
	}

	console.log("Delivered Notion message: ", JSONobject)
}
