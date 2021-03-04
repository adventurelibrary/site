import {Asset, AssetSearchOptions, AssetTag} from "adventurelibrary/dist/assets/asset-types";
import {newSearchOptions} from "adventurelibrary/dist/assets/asset-helpers";
import {AssetSearchFilter, stringToFilterType} from "adventurelibrary/dist/assets/search-filters";
import {AssetTags} from "adventurelibrary/dist/assets/asset-consts";

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
				const tag = AssetTags.find((x : AssetTag) => {
					return x.key === suffix
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

	return {
		query: $route.query.search || '',
		filters: filters
	}
}
