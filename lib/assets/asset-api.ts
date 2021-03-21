import {
	Asset,
	AssetFormData,
	AssetPayload,
	AssetResponse,
	AssetSearchOptions,
	AssetSignatureResponse,
	AssetsResponse, AssetTag, AssetUploadResponse
} from "./asset-types";
import {Ajax, newAjax} from "../ajax";
import {AssetTags} from "./asset-consts";
import {ActiveUpload} from "~/lib/assets/asset-uploads";
import api from "~/lib/api"

// These are here so we don't have to have a server
const ASSETS : Record<string, Asset> = {
	'a-town':  {
		id: '324432',
		description: 'A lovely little town',
		thumbnailSrc: 'https://i.imgur.com/1oVr25o.jpg',
		slug: 'a-town',
		title: 'A Town',
		type: 'map',
		tags: [AssetTags[0], AssetTags[1]],
	},
	'cool-token': {
		id: '321421',
		thumbnailSrc: 'https://i.imgur.com/yb7faCO.png',
		slug: 'cool-token',
		type: 'token',
		title: 'Cool Token!',
		description: "It's a neat looking token",
		tags: [AssetTags[3]]
	}
}

const ASSETS_LIST = Object.keys(ASSETS).map((key) => {
	return ASSETS[key]
})

export const searchAssets = async (opts: AssetSearchOptions) : Promise<AssetsResponse> => {
	let assets : Asset[] = []
	const query = (opts.query || '').toLowerCase().trim()
	const filters = opts.filters

	if (!query.length && !filters.length) {
		assets = ASSETS_LIST
	} else {
		// Go through all the hardcoded assets and perform some searching on them
		// Each filter has a type, for what kind of filter it is
		// This search does only a huge OR search. If ANY filter matches, the asset
		// is returned
		Object.values(ASSETS).forEach((asset: Asset) => {
			let found = false
			if (query.length && asset.title.toLowerCase().indexOf(query) >= 0) {
				found = true
			}
			for (let i = 0; i < filters.length; i++) {
				const filter = filters[i]
				if (filter.type == 'type') {
					if (filter.value === asset.type) {
						found = true
						break
					}
				}
				if (filter.type == 'tag') {
					for (let j = 0; j < asset.tags.length; j++) {
						const tag = asset.tags[j]
						if (tag.key === filter.value) {
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

	return new Promise<AssetsResponse>((res) => {
		setTimeout(() => {
			res({
				total: assets.length,
				results: assets
			})
		}, 220)
	})
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
				results: ASSETS_LIST
			})
		}, 220)
	})
}

export const getAsset = async (slug: string) : Promise<AssetResponse> => {
	return new Promise<AssetResponse>((res, rej) => {
		setTimeout(() => {
			const asset = ASSETS[slug]

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
		const asset = await getAsset(slug)
		ajax.data = asset
	} catch (ex) {
		ajax.error = ex.toString()
	}

	ajax.loading = false
	return ajax
}

export const getAssetAjaxById = async(id: string) : Promise<Ajax<AssetResponse>> => {
	console.log('getAssetAjaxById id', id)
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
				asset: Object.assign({}, asset),
				creator: {name: 'fubar artist'}
			})
		}, 100)
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
		title: '',
		description: '',
		slug: '',
		type: "map",
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
	payload.asset.title = data.title
	payload.asset.description = data.description
	payload.asset.type = data.type
	payload.asset.tags = data.tags.map((at: AssetTag) : string => {
		return at.key
	})
	return payload
}
