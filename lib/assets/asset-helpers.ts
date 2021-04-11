import {AssetSearchOptions, SortDirection} from "./asset-types";
import {AssetSearchFilter} from "./search-filters";

export const SORT_FIELD_DEFAULT = 'uploaded'
export const SORT_DIR_DEFAULT : SortDirection = 'desc'
export const SORT_DEFAULT_SIZE = 10 // how many assets to show on a page

export const newSearchOptions = () : AssetSearchOptions => {
	return {
		query: '',
		filters: [],
		sortField: SORT_FIELD_DEFAULT,
		sortDirection: SORT_DIR_DEFAULT,
		from: 0,
		size: SORT_DEFAULT_SIZE,
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

// This converts the search options that our user has put together with the
// search component, and converts it into a query string that will be
// navigated to
// So if a user selects two tags, Fall & Winter, and searches "fire" this function is what gets
// us something like ?filters=t_Fall,t_Winter&query=fire
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
