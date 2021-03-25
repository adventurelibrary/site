import {AssetSearchOptions, AssetCategory, SortDirection} from "./asset-types";
import {ASSET_CATEGORIES} from "./asset-consts";
import {commaAndJoin} from "../helpers";
import {AssetSearchFilter} from "./search-filters";

export const SORT_FIELD_DEFAULT = 'date'
export const SORT_DIR_DEFAULT : SortDirection = 'desc'

export const newSearchOptions = () : AssetSearchOptions => {
	return {
		query: '',
		filters: [],
		sortField: SORT_FIELD_DEFAULT,
		sortDirection: SORT_DIR_DEFAULT
	}
}

export const stringToSortDirection = (str: string) : SortDirection => {
	if (str == 'desc') {
		return 'desc'
	}
	if (str == 'asc') {
		return 'asc'
	}

	return 'desc'
}

export function assetSearchOptionsToQuery(options: AssetSearchOptions) : any {
	const query : any = {}
	if (options.query) {
		query.search = options.query
	}
	const filtersList = options.filters.map((filter: AssetSearchFilter) : string => {
		const filterStr = filter.type + '_' + filter.value
		return filterStr
	})

	if (filtersList.length) {
		query.filters = filtersList.join(',')
	}

	if (options.sortDirection !== SORT_DIR_DEFAULT || options.sortField !== SORT_FIELD_DEFAULT) {
		query.sort = options.sortDirection == 'desc' ? '-' : ''
		query.sort += options.sortField
	}

	return query
}

export function getAssetCategory(id: string) : (AssetCategory | null) {
	for (let i = 0; i < ASSET_CATEGORIES.length; i++) {
		if (ASSET_CATEGORIES[i].id == id) {
			return ASSET_CATEGORIES[i]
		}
	}

	return null
}

export function typeKeysToObjects (keys : string[]) : AssetCategory[] {
	const types : AssetCategory[] = []
	keys.forEach((key: string) => {
		const type = getAssetCategory(key)
		if (type) {
			types.push(type)
		}
	})
	return types
}

export function typeKeysCommaList(keys : string[]) : string {
	const types = typeKeysToObjects(keys)
	const words : string[] = []
	types.forEach((type: AssetCategory) => {
		words.push(type.plural)
	})

	return commaAndJoin(words)
}
