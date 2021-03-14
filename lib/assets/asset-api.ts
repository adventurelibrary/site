import {
	Asset,
	AssetFields, AssetFormData,
	AssetPayload,
	AssetResponse,
	AssetSearchOptions,
	AssetSignatureResponse,
	AssetsResponse, AssetTag
} from "./asset-types";
import {Ajax, newAjax} from "../ajax";
import {AssetTags} from "./asset-consts";
import {ActiveUpload} from "~/lib/assets/asset-uploads";

// These are here so we don't have to have a server
const ASSETS : Record<string, Asset> = {
	'a-town':  {
		id: '324432',
		description: 'A lovely little town',
		thumbnailSrc: 'https://i.imgur.com/1oVr25o.jpg',
		slug: 'a-town',
		title: 'A Town',
		type: 'map',
		tags: [AssetTags[0], AssetTags[1]]
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
	const res = await createAssetSignature(au.asset)
	au.signature = res.signature
	au.status = 'signed'
}

export const createAssetSignature = async (fields: AssetFormData) : Promise<AssetSignatureResponse> => {
	const data = assetFormDataToPayload(fields)
	console.log('sending this payload', data)
	return new Promise<AssetSignatureResponse>((res) => {
		setTimeout(() => {
			res({
				signature: btoa(fields.title + new Date().getTime().toString())
			})
		}, 220)
	})
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
				asset: Object.assign({}, asset)
			})
		}, 100)
	})
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
				asset: Object.assign({}, asset)
			})
		}, 100)
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
		asset: newAsset()
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
	payload.asset.tags = data.tags.map((at: AssetTag) : string => {
		return at.key
	})
	return payload
}
