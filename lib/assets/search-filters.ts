import {AssetTag} from "./asset-types";
import {Category} from "~/lib/categories/category-types";

export type FilterType = 'tag' | 'creator' | 'price' | 'type'

const FilterTypeMap : Record<string, FilterType> = {
	'tag': 'tag',
	'creator': 'creator',
	'price': 'price',
	'type': 'type'
}

export interface AssetSearchFilter {
	type: FilterType
	label: string
	value: string
}

export function assetTypeToFilter(type: Category) : AssetSearchFilter {
	return  {
		type: 'type',
		label: type.plural,
		value: type.id
	}
}
export function tagToFilter(tag: AssetTag) : AssetSearchFilter {
	return {
		type: 'tag',
		label: tag.label,
		value: tag.id
	}
}

export function stringToFilterType (str: string) : FilterType | null {
	if (FilterTypeMap.hasOwnProperty(str)) {
		return FilterTypeMap[str]
	}
	return null
}
