import {AssetSearchAction} from "./asset-types";
import {SelectOption} from "~/lib/helpers";

export const AssetSearchActions : AssetSearchAction[] = [{
	key: 'category',
	prefix: 'category',
	description: 'filter by map, token, character',
}, {
	key: 'tag',
	prefix: 'tag',
	description: 'find assets with specific tags',
}, {
	key: 'creator',
	prefix: 'creator',
	description: 'search by creator name'
}]


export const VisibilityOptions : SelectOption[] = [{
	label: 'Hidden',
	value: 'HIDDEN'
/*}, {
	// This is waiting for transloadit, so you can't actually set an asset to that setting
	label: 'Pending',
	value: 'PENDING'*/
}, {
	label: 'Public',
	value: 'PUBLIC'
}]

export const ACCEPTED_IMAGE_TYPES = 'image/png, image/jpg, image/jpeg'
