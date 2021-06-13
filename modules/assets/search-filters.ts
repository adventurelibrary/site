import {AssetTag} from "./asset-types";
import {Category} from "~/modules/categories/categories-types";

export type FilterType = 'tag' | 'creator' | 'price' | 'category'

const FilterTypeMap : Record<string, FilterType> = {
	'tag': 'tag',
	'creator': 'creator',
	'price': 'price',
	'category': 'category'
}

export interface AssetSearchFilter {
	type: FilterType
	label: string
	value: string
}

export function assetCategoryToFilter(category: Category) : AssetSearchFilter {
	return  {
		type: 'category',
		label: category.plural,
		value: category.id
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
