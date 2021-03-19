import {AssetSearchAction, AssetTag, AssetType, AssetTypeOption} from "./asset-types";
import {SelectOption} from "../helpers";

export const AssetTypes : AssetType[] = [{
	key: 'map',
	singular: 'Map',
	plural: 'Maps'
}, {
	key: 'token',
	singular: 'Token',
	plural: 'Tokens'
}, {
	key: 'portrait',
	singular: 'Portrait',
	plural: 'Portraits'
}]

export const AssetTags : AssetTag[] = `Winter,Summer,Fall,Spring,Fantasy,Orc,Archer,Priest,Barbarian,Town,Village,Castle`
.split(',')
.sort()
.map((label: string) => {
	return {
		label: label,
		key: label.toLocaleLowerCase(),
	}
})

export const AssetSearchActions : AssetSearchAction[] = [{
	key: 'type',
	prefix: 'type',
	description: 'filter by map, token, character',
}, {
	key: 'tag',
	prefix: 'tag',
	description: 'find assets with specific tags',
}]

export const AssetTypeOptions : AssetTypeOption[] = AssetTypes.map((type: AssetType) : AssetTypeOption => {
	return {
		value: type.key,
		label: type.plural
	}
})

export const AssetTypeOptionsSingular : AssetTypeOption[] = AssetTypes.map((type: AssetType) : AssetTypeOption => {
	return {
		value: type.key,
		label: type.singular
	}
})

export const AssetTagOptions : SelectOption[] = AssetTags.map((type: AssetTag) : SelectOption => {
	return {
		value: type.key,
		label: type.label
	}
})

export const ACCEPTED_IMAGE_TYPES = 'image/png, image/jpg, image/jpeg'
