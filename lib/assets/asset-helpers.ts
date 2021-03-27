import {AssetSearchOptions, SortDirection} from "./asset-types";
import {commaAndJoin} from "../helpers";
import {AssetSearchFilter} from "./search-filters";
import {getCategoryById} from "~/lib/categories/categories-api";

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
