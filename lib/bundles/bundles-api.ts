import {BundleResponse, BundlesResponse} from "~/lib/bundles/bundle-types";
import api from "~/lib/api";
import {Ajax, newAjax} from "~/lib/ajax";

function bundleFormDataToPayload (data: any, assetIds : string[]) : any {
	return {
		bundle: {
			name: data.name,
			description: data.description,
			public: data.public
		},
		assetIds: assetIds
	}
}

export async function getBundle (id: string)  : Promise<BundleResponse> {
	const res = await api.get<Promise<BundleResponse>>('/bundle?id=' + id)
	return res.data
}

export async function getMyBundles (page = 1) : Promise<BundlesResponse> {
	const limit = 20
	const start = (page - 1) * limit
	console.log('Get the from ' + start + ' to ' + (start+limit) + ', more or less')
	return new Promise((res) => {
		setTimeout(() => {
			res({
				bundles: [{
					id: 'kfsdlasfdasfdsafa',
					name: 'Dark Heresy Campaign',
					public: true,
					description: '',
					numAssets: 2,
					slug: "examplebundle1"
				}, {
					id: '34dagdsagdsag',
					name: 'Forest Maps (page ' + page + ')',
					description: '',
					public: true,
					numAssets: 3,
					slug: "examplebundle2"
				}],
				total: 124,
			})
		}, 500)
	})
	/*const res = await api.get<Promise<BundlesResponse>>('/my-bundles')
	return res.data*/
}

export async function createBundle (formData : any, assetIds : string[]) {
	const payload = bundleFormDataToPayload(formData, assetIds)
	await api.post('/bundle', payload)
}

export async function updateBundle (id: string, formData : any) {
	const payload = bundleFormDataToPayload(formData, [])
	await api.put('/bundle?id=' + id, payload)
}

export async function deleteBundle (id: string) {
	await api.delete('/bundle?id=' + id)
}

export function newBundlesAjax () : Ajax<BundlesResponse> {
	return newAjax<BundlesResponse>({
		total: 0,
		bundles: []
	})
}

export function newBundleAjax () : Ajax<BundleResponse> {
	return newAjax<BundleResponse>({
		assets: []
	})
}

export async function addAssetToBundles (assetId: string, bundleIds: string[]) {
	await api.post(`/add-asset-to-bundles?id=${assetId}`, {
		bundleIds: bundleIds
	})
}
