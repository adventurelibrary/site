import {AssetSearchFilter} from "./search-filters";

// These fields exist on assets that are in our db AND in assets
// that the user is about to upload
export type AssetFields = {
	description: string
	title: string
	type: AssetTypeKey
	tags: AssetTag[]
}

export type Asset  = AssetFields & {
	id: string
	thumbnailSrc: string
	slug: string
}

export type NewAsset = {
	asset: AssetFields,
	file: File
}

export interface AssetFormData extends Asset {
	// Extra fields that the form might have, but that aren't specifically tied to the asset
	// will go here
	// EG: a boolean that says "email my followers about this asset"
	// That would be here and not in Asset because it isn't data that is stored  in the asset, it's
	// a flag to tell the server to perform another funtion
}

// Data sent by browser to the server to create/update an asset
export type AssetPayload = {
	asset: Asset
}

// Data returned by the server about a specific asset
export type AssetResponse = {
	asset: Asset
}

export type AssetTypeKey = 'map' | 'token' | 'portrait'

export type SortDirection = 'asc' | 'desc'

export type AssetSearchOptions = {
	filters: AssetSearchFilter[]
	query: string,
	sortField: string,
	sortDirection: SortDirection
}

export type AssetsResponse = {
	results: Asset[],
	total: number,
}

export type AssetTypeOption = {
	value: AssetTypeKey,
	label: string
}

export type AssetType = {
	key: AssetTypeKey,
	singular: string
	plural: string
}

export type AssetTag = {
	key: string,
	label: string
}

export type AssetSearchAction = {
	key: string,
	prefix: string,
	description: string
}

// Putting this here causes the proper files to be rebuilt when you save this file
// so that nuxt will properly rebuild if a type is changed
export const fake2 = () => {
	return
}