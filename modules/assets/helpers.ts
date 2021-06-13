import {AssetSearchOptions, AssetTag} from "~/modules/assets/asset-types";
import {newSearchOptions, SORT_DEFAULT_SIZE, SORT_DIR_DEFAULT, SORT_FIELD_DEFAULT} from "~/modules/assets/asset-helpers";
import {AssetSearchFilter, stringToFilterType} from "~/modules/assets/search-filters";
import {ASSET_TAGS} from "~/modules/tags/tags-consts";

export function getRouteAssetSearchOptions ($route: any) : AssetSearchOptions {
	if (!$route) {
		return newSearchOptions()
	}

	let filters = []
	if ($route.query.filters && $route.query.filters.length) {
		const str = $route.query.filters.toString()
		filters = str.split(',').reduce((list : AssetSearchFilter[], text : string) : AssetSearchFilter[] => {
			let parts = text.split('_')
			let prefix : string
			let suffix : string

			// We only want the first _ to split the filter
			// If a filter is shown as "tag_science_fiction" in the query
			// that should be {type: 'tag', value: 'science_fiction'}
			if (parts.length > 2) {
				const first = parts.shift()
				if (first) {
					prefix = first
				} else {
					prefix = 'tag'
				}
				suffix = parts.join('_')
			} else {
				prefix = parts[0]
				suffix = parts[1]
			}

			const type = stringToFilterType(prefix)
			if (type === null) {
				return list
			}

			let label = suffix

			if (type === 'tag') {
				const tag = ASSET_TAGS.find((x : AssetTag) => {
					return x.id === suffix
				})
				if (tag) {
					label = tag.label
				}
			}

			list.push({
				label: label,
				type: type,
				value: suffix
			})
			return list
		}, [])
	}

	let sortField = SORT_FIELD_DEFAULT
	let sortDirection = SORT_DIR_DEFAULT
	const querySort = $route.query.sort
	if (querySort) {
		if (querySort.substr(0, 1)) {
			sortDirection = 'desc'
			sortField = querySort.substr(1)
		} else {
			sortDirection = 'asc'
			sortField = querySort
		}
	}

	let pageS = $route.query.page
	let page = 1

	if (pageS) {
		page = parseInt(pageS)
		if (!page) {
			page = 1
		}
	}
	const size = SORT_DEFAULT_SIZE
	const from = (page - 1) * size

	return {
		query: $route.query.search || '',
		filters: filters,
		sortField: sortField,
		sortDirection: sortDirection,
		from: from,
		size: size
	}
}
