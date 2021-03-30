import {
	Asset, AssetDownloadOptions, AssetDownloadResponse,
	AssetFormData,
	AssetPayload,
	AssetResponse,
	AssetSearchOptions,
	AssetSignatureResponse,
	AssetsResponse, AssetUploadResponse
} from "./asset-types";
import {Ajax, newAjax} from "../ajax";
import {ActiveUpload} from "~/lib/assets/asset-uploads";
import api from "~/lib/api"
import {getTagById, tagListToMap} from "~/lib/tags/tags-api";

// These are here so we don't have to have a server
const ASSETS : Record<string, Asset> = require('./assets-data.json')

const ASSETS_LIST = Object.keys(ASSETS).map((key) => {
	return ASSETS[key]
}).sort((a,b) => {
	return a.name > b.name ? 1 : -1
})

export const searchAssets = async (opts: AssetSearchOptions) : Promise<AssetsResponse> => {
	let assets : Asset[] = []
	const query = (opts.query || '').toLowerCase().trim()
	const filters = opts.filters
	let size = opts.size
	let from = opts.from
	console.log('search from', from)
	if (size > 40) {
		size = 40
	}

	if (!query.length && !filters.length) {
		assets = ASSETS_LIST
	} else {
		// Go through all the hardcoded assets and perform some searching on them
		// Each filter has a type, for what kind of filter it is
		// This search does only a huge OR search. If ANY filter matches, the asset
		// is returned
		Object.values(ASSETS).forEach((asset: Asset) => {
			let found = false
			if (query.length && asset.name.toLowerCase().indexOf(query) >= 0) {
				found = true
			}
			for (let i = 0; i < filters.length; i++) {
				const filter = filters[i]
				if (filter.type == 'category') {
					if (filter.value === asset.categoryID) {
						found = true
						break
					}
				}
				if (filter.type == 'tag') {
					for (let j = 0; j < asset.tags.length; j++) {
						const tag = asset.tags[j]
						if (tag.id === filter.value) {
							found = true
							break
						}
					}
				}
			}

			if (found) {
				assets.push(asset)
			}
		})
	}

	const results = assets.slice(from, size+from).map(transformAsset)

	return new Promise<AssetsResponse>((res) => {
		setTimeout(() => {
			res({
				total: assets.length,
				results: results
			})
		}, 500)
	})
}

// This function is used to cleanup any data that the server gives us
export function transformAsset (asset: Asset) : Asset {
	asset.tags = []
	Object.keys(asset.tagIDs).forEach((tagId:string) => {
		const tag = getTagById(tagId)
		if (tag) {
			asset.tags.push(tag)
		}
	})
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
	const res = await api.post<AssetSignatureResponse>('assets/get_signature', {
		fileName: filename,
		userName: 'site',
		assetData: data
	})
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
	return new Promise<AssetsResponse>((res) => {
		setTimeout(() => {
			res({
				total: Object.keys(ASSETS).length,
				results: ASSETS_LIST.slice(0, 10).map(transformAsset)
			})
		}, 220)
	})
}

export const getAssetBySlug = async (slug: string) : Promise<AssetResponse> => {
	return new Promise<AssetResponse>((res, rej) => {
		setTimeout(() => {
			const asset = ASSETS_LIST.find((a) => {
				return a.slug == slug
			})

			if (!asset) {
				rej(new Error('Cannot find that asset'))
				return
			}

			res({
				asset: Object.assign({}, asset),
				creator: {name: 'fubar artist'}
			})
		}, 100)
	})
}

export const getAssetAjax = async(slug: string) : Promise<Ajax<AssetResponse>> => {
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

export const getAssetAjaxById = async(id: string) : Promise<Ajax<AssetResponse>> => {
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

export const getAssetById = async (id: string) : Promise<AssetResponse> => {
	return new Promise<AssetResponse>((res, rej) => {
		setTimeout(() => {
			const asset = ASSETS_LIST.find(x => x.id == id)

			if (!asset) {
				rej(new Error('Cannot find that asset'))
				return
			}

			res({
				asset: transformAsset(Object.assign({}, asset)),
				creator: {name: 'fubar artist'}
			})
		}, 100)
	})
}

export async function getAssetDownloadLink(id: string, options: AssetDownloadOptions) : Promise<AssetDownloadResponse> {
	return new Promise<AssetDownloadResponse>((res) => {
		setTimeout(() => {
			res({
				url: `https://assetlibrary.art/download/${id}?file=${options.file}`
			})
		}, 250)
	})
}

export async function getAssets() : Promise<AssetsResponse> {
	return new Promise<AssetsResponse>((res) => {
		setTimeout(() => {
			res({
				results: ASSETS_LIST,
				total: ASSETS_LIST.length
			})
		}, 200)
	})
}

export const newAsset = () : Asset => {
	return {
		id: '',
		categoryID: '',
		creatorID: '',
		creatorName: '',
		description: '',
		name: '',
		slug: '',
		tagIDs: {},
		tags: [],
		thumbnailSrc: ''
	}
}

// Creates a new Ajax object for a component that needs to load a list of assets
// The Ajax component adds functionality for 'loading' and 'error'
export const newAssetsAjax = () : Ajax<AssetsResponse> => {
	return newAjax<AssetsResponse>({
		results: [],
		total: 0
	})
}

export const newAssetAjax = () : Ajax<AssetResponse> => {
	return newAjax<AssetResponse>({
		asset: newAsset(),
		creator: {name : ''}
	})
}

export const saveAsset = async (id: string, data: AssetFormData) => {
	console.log(id, data)
	return new Promise((res, rej) => {
		setTimeout(() => {
			if (Math.random() < 0.5) {
				rej(new Error('Random error from the server'))
				return
			}
			res(null)
		}, 250)
	})
}

// This function is used to take what the server gives us for an asset,
// and convert it into the data format that our forms use
// For example if the server returns {creator: {id: '123', name: 'Jill'}...}
// we might want our form data to have {creatorId: '123'}. The form doesn't care
// about the name of the creator, just its id
export const assetResponseToFormData = (resp: AssetResponse) : AssetFormData => {
	return resp.asset
}

export const assetFormDataToPayload = (data: AssetFormData) : AssetPayload => {
	const payload  : AssetPayload = {
		asset: {}
	}

	payload.asset.name = data.name
	payload.asset.description = data.description
	payload.asset.categoryID = data.categoryID
	payload.asset.tagIDs = tagListToMap(data.tags)
	return payload
}
