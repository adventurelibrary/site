import {AssetSearchOptions} from "adventurelibrary/dist/assets/asset-types";
import {newSearchOptions} from "adventurelibrary/dist/assets/asset-helpers";

export function getAssetSearch ($route: any) : AssetSearchOptions {
	if (!$route) {
		return newSearchOptions()
	}

	const typesCsv = $route.query.types || ''
	const types = typesCsv.length > 0 ? typesCsv.split(',') : []

	const tagsCsv = $route.query.tags || ''
	const tags = tagsCsv.length > 0 ? tagsCsv.split(',') : []

	return {
		query: $route.query.search || '',
		types,
		tags,
	}
}
