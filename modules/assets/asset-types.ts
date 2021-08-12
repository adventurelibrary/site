import {AssetSearchFilter} from "./search-filters";
import {Creator} from "~/modules/creators/creator-types";

export type AssetVisibility = 'PENDING' | 'HIDDEN' | 'PUBLIC'

// These fields exist on assets that are in our db AND in assets
// that the user is about to upload
export type AssetFields = {
	category: string
	description: string
	creator_id: string
	name: string
	tags: string[]
	tagObjects: AssetTag[]
	visibility: AssetVisibility
}

// This is an asset that the server gives us
export type Asset = AssetFields & {
	id: string
	creator_name: string
	creator_id: string
	unlocked: boolean // True for users who have bought it. False for those who haven't. False if not logged in
	slug: string
	thumbnail: string
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
	creator_id: string
}

// Data sent by browser to the server to create/update an asset
export type AssetPayload = {
	asset: any
}

// Data returned by the server about a specific asset
export type AssetResponse = {
	asset: Asset
	creator: Creator
}

export interface AssetUpdate {
	id: string
}

export type SortDirection = 'asc' | 'desc'

export type AssetSearchOptions = {
	filters: AssetSearchFilter[]
	query: string,
	sortField: string,
	sortDirection: SortDirection
	from: number
	size: number
	mine?: boolean
	visibility?: string
}

export type AssetsResponse = {
	assets: Asset[],
	total: number,
}

export type AssetTag = {
	id: string,
	label: string,
	aliases: string[]
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

export type AssetDownloadResponse = {
	url: string
}

export type AssetDownloadOptions = {
	file: string
}

// This is the info that the server sends back to us after
// a user has unlocked an asset
export type UnlockAssetResponse = {
	numCoins: number // Their new balance
}
