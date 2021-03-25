import {AssetSearchFilter} from "./search-filters";

// These fields exist on assets that are in our db AND in assets
// that the user is about to upload
export type AssetFields = {
	categoryID: string
	description: string
	name: string
	tagIDs: Record<string, number>
}

// This is an asset that the server gives us
export type Asset = AssetFields & {
	id: string
	creatorName: string
	creatorID: string
	slug: string
	tags: AssetTag[]
	thumbnailSrc: string
}

// This is created when a user drags and drops a file or selects files
// to upload
export type NewAsset = {
	asset: AssetFields,
	file: File
}

export interface AssetFormData extends AssetFields {
	// Extra fields that the form might have, but that aren't specifically tied to the asset
	// will go here
	// EG: a boolean that says "email my followers about this asset"
	// That would be here and not in Asset because it isn't data that is stored  in the asset, it's
	// a flag to tell the server to perform another function
}

// Data sent by browser to the server to create/update an asset
export type AssetPayload = {
	asset: any
}

export type Creator = {
	name: string
}

// Data returned by the server about a specific asset
export type AssetResponse = {
	asset: Asset
	creator: Creator
}

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
	value: string, // id
	label: string
}

export type AssetCategory = {
	id: string,
	singular: string
	plural: string
}

export type AssetTag = {
	id: string,
	label: string
}

export type AssetSearchAction = {
	key: string,
	prefix: string,
	description: string
}

export type AssetSignatureResponse = {
	signature: string,
	params: any
}

export type AssetUploadResponse = {

}
