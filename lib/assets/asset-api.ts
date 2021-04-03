import {
	Asset, AssetDownloadOptions, AssetDownloadResponse,
	AssetFormData,
	AssetPayload,
	AssetSearchOptions,
	AssetSignatureResponse,
	AssetsResponse, AssetTag, AssetUpdate, AssetUploadResponse, AssetVisibility, SortDirection
} from "./asset-types";
import {Ajax, newAjax} from "../ajax";
import {ActiveUpload} from "~/lib/assets/asset-uploads";
import api from "~/lib/api"
import {getTagById, tagListToMap} from "~/lib/tags/tags-api";
import {AssetSearchFilter} from "~/lib/assets/search-filters";
import {newSearchOptions, SORT_DIR_DEFAULT, SORT_FIELD_DEFAULT} from "~/lib/assets/asset-helpers";
import {objectToQueryString} from "~/lib/helpers";

// These are here so we don't have to have a server
const ASSETS : Record<string, Asset> = require('./assets-data.json')

const ASSETS_LIST = Object.keys(ASSETS).map((key) => {
	return ASSETS[key]
}).sort((a,b) => {
	return a.name > b.name ? 1 : -1
})

export function getSearchOptionsSortField (opts: AssetSearchOptions) : string {
	return opts.sortField || SORT_FIELD_DEFAULT
}

export function getSearchOptionsSortDirection (opts: AssetSearchOptions) : SortDirection {
	return opts.sortDirection || SORT_DIR_DEFAULT
}

// This function is used to create the object that our API expects to receive to search for assets
export const assetSearchOptionsToAPIQuery = (opts : AssetSearchOptions) : Record<string, string> => {
	const search = (opts.query || '').toLowerCase().trim()
	const filters = opts.filters
	const tags : string[] = []
	const categories : string[] = []

	filters.forEach((filter: AssetSearchFilter) => {
		if (filter.type === 'tag') {
			tags.push(filter.value)
			return
		}
		if (filter.type === 'category') {
			categories.push(filter.value)
			return
		}
	})
	const query : Record<string, string> = {}

	query.sort = getSearchOptionsSortField(opts)
	query.sort_type = getSearchOptionsSortDirection(opts)

	if (search && search.length) {
		query.text = search
	}
	if (tags.length) {
		query.tags = tags.join(',')
	}
	if (categories.length) {
		query.category = categories.join(',')
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

export async function queryAssets (opts: Record<string, string>) : Promise<AssetsResponse> {
	const res = await api.get<AssetsResponse>('/assets?' + objectToQueryString(opts))
	res.data.assets = res.data.assets.map(transformAsset)
	return res.data
}

export async function searchAdminAssets (opts: AssetSearchOptions) : Promise<AssetsResponse> {
	const apiQuery = assetSearchOptionsToAPIQuery(opts)
	apiQuery.visibility = 'all'
	return await queryAssets(apiQuery)
}

export const searchAssets = async (opts: AssetSearchOptions) : Promise<AssetsResponse> => {
	const apiQuery = assetSearchOptionsToAPIQuery(opts)
	return await queryAssets(apiQuery)
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

export const signActiveUpload = async (au : ActiveUpload) => {
	const res = await createAssetSignature(au.file.name, au.asset)
	au.signature = res.signature
	au.status = 'signed'
	au.params = res.params
}

export const createAssetSignature = async (filename: string, fields: AssetFormData) : Promise<AssetSignatureResponse> => {
	const data = assetFormDataToPayload(fields)
	const res = await api.post<AssetSignatureResponse>('assets/get_signature', data)
	return res.data
}

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

export const getFeaturedAssets = async () : Promise<AssetsResponse> => {
	return searchAssets(newSearchOptions())
}

export async function getAssetByField(field: string, value: string) : Promise<Asset> {
	const res = await api.get<Asset>(`/assets?${field}=${value}`)
	return res.data
}

export const getAssetBySlug = async (slug: string) : Promise<Asset> => {
	const parts = slug.split('-')
	const id = parts[parts.length-1]
	return getAssetById(id)
}

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
	const res = await getAssetByField('id', id)
	const asset = transformAsset(res)
	return asset
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getAssetDownloadLink(id: string, options: AssetDownloadOptions) : Promise<string> {
	const res = await api.get<AssetDownloadResponse>(`/assets/download?id=${id}&type=original`)
	return res.data.url
}

export async function getAssets() : Promise<AssetsResponse> {
	return new Promise<AssetsResponse>((res) => {
		setTimeout(() => {
			res({
				assets: ASSETS_LIST,
				total: ASSETS_LIST.length
			})
		}, 200)
	})
}

export async function syncAssets () {
	return await api.post('/assets/sync')
}

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
		creatorID: '',
		creatorName: '',
		description: '',
		name: '',
		slug: '',
		tags: [],
		tagObjects: [],
		thumbnail: '',
		visibility: 'HIDDEN'
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

export const saveAssets = async (payloads: AssetUpdate[]) => {
	return await api.put('/assets/update', payloads)
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

export const assetFormDataToPayload = (data: AssetFormData) : any => {
	const payload : any = {}
	payload.name = data.name
	payload.description = data.description
	payload.category = data.category
	//payload.tagIDs = tagListToMap(data.tags)
	payload.tags = data.tagObjects.map((t) => {
		return t.label
	})
	payload.collectionID = new Date().getTime().toString()
	payload.unlockPrice = 0
	payload.revenueShare = {}
	return payload
}
