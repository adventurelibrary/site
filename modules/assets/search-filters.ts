import {AssetTag} from "./asset-types";
import {Category} from "~/modules/categories/categories-types";
import {getCreators} from "~/modules/creators/creator-api"
import {Creator} from "../creators/creator-types";

export type FilterType = 'tag' | 'creator' | 'price' | 'category'

// This is how we convert strings (like from a query param) into FilterTypes
// and also how confirm that a given string is one of our filter types
const FilterTypeMap : Record<string, FilterType> = {
	'tag': 'tag',
	'creator': 'creator',
	'price': 'price',
	'category': 'category'
}

// When a user is searching for things, they use our search form to compile a list of these AssetSearchFilters
// A user whose goal is "I want 'maps' tagged with 'Archer'" would end up creating two AssetSearchFilters in
// the form they're interacting with: one saying type=maps and another says tags<<Archer
export interface AssetSearchFilter {
	type: FilterType
	label: string
	value: string
}

// Converts a given category (map, scene, character, token) into a Filter
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
export function creatorToFilter(creator: Creator) : AssetSearchFilter {
	console.log('creatorToFilter run')
	const creators = getCreators()
	console.log('creator result', creators)
	//for (creator in creators){
	//	console.log('creator: ', creator.name)
	//}
	return {
		type: 'creator',
		label: creator.name,
		value: creator.id
	}
}

// This function is used when we get a filter type from the URL of the page the user is on
// so that we can convert the query parameters there (which are straight strings) into the
// types that we expect
export function stringToFilterType (str: string) : FilterType | null {
	if (FilterTypeMap.hasOwnProperty(str)) {
		return FilterTypeMap[str]
	}
	return null
}
