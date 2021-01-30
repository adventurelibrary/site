import {AssetSearchOptions} from "adventurelibrary/dist/assets/asset-types";

export function getAssetSearch ($route: any) : AssetSearchOptions {
	if (!$route) {
		return {
			query: '',
			types: []
		}
	}

	const typesCsv = $route.query.types || ''
	const types = typesCsv.length > 0 ? typesCsv.split(',') : []

	return {
		query: $route.query.search || '',
		types
	}
}
