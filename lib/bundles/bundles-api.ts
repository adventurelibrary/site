import {BundleResponse, BundlesResponse} from "~/lib/bundles/bundle-types";
import api from "~/lib/api";
import {Ajax, newAjax} from "~/lib/ajax";

function bundleFormDataToPayload (data: any, assetIds : string[]) : any {
	return {
		bundle: {
			name: data.name,
			description: data.description,
		},
		assetIds: assetIds
	}
}

export async function getBundle (id: string)  : Promise<BundleResponse> {
	const res = await api.get<Promise<BundleResponse>>('/bundle?id=' + id)
	return res.data
}

export async function getMyBundles () : Promise<BundlesResponse> {
	return new Promise((res) => {
		setTimeout(() => {
			res({
				bundles: [{
					id: 'kfsdlasfdasfdsafa',
					name: 'Dark Heresy Campaign',
					description: '',
					numAssets: 2
				}, {
					id: '34dagdsagdsag',
					name: 'Forest Maps',
					description: '',
					numAssets: 3
				}],
				total: 1,
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

export function newBundlesAjax () : Ajax<BundlesResponse> {
	return newAjax<BundlesResponse>({
		total: 0,
		bundles: []
	})
}
