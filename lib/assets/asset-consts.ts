import {AssetSearchAction} from "./asset-types";

export const AssetSearchActions : AssetSearchAction[] = [{
	key: 'type',
	prefix: 'type',
	description: 'filter by map, token, character',
}, {
	key: 'tag',
	prefix: 'tag',
	description: 'find assets with specific tags',
}]


export const ACCEPTED_IMAGE_TYPES = 'image/png, image/jpg, image/jpeg'
