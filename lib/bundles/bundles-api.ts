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

	const res = await api.get<Promise<BundlesResponse>>(`/bundles`)
	return res.data
}

export async function createBundle (formData : any, assetIds : string[]) {
	const payload = bundleFormDataToPayload(formData, assetIds)
	await api.post('/bundles/create', payload)
}

export async function updateBundle (id: string, formData : any) {
	const payload = bundleFormDataToPayload(formData, [])
	await api.put('/bundles/' + id, payload)
}

export async function deleteBundle (id: string) {
	await api.delete('/bundles/' + id)
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

export async function addAssetsToBundle(bundleId: string, assetIds: string[]) {
	await api.put('/bundles/' + bundleId, {
		added_assets: assetIds
	})
}

export async function removeAssetsFromBundle(bundleId: string, assetIds: string[]) {
	await api.put('/bundles/' + bundleId, {
		removed_assets: assetIds
	})
}

export async function addAssetToBundles (assetId: string, bundleIds: string[]) {
	for (let i = 0; i < bundleIds.length; i++) {
		await addAssetsToBundle(bundleIds[i], [assetId])
	}
}
