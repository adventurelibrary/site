import {AssetTag, AssetType} from "./asset-types";

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

export function assetTypeToFilter(type: AssetType) : AssetSearchFilter {
	return  {
		type: 'type',
		label: type.plural,
		value: type.key
	}
}
export function tagToFilter(tag: AssetTag) : AssetSearchFilter {
	return {
		type: 'tag',
		label: tag.label,
		value: tag.key
	}
}

export function stringToFilterType (str: string) : FilterType | null {
	if (FilterTypeMap.hasOwnProperty(str)) {
		return FilterTypeMap[str]
	}
	return null
}
