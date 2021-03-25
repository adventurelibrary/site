import {AssetSearchAction, AssetTag, AssetCategory, AssetTypeOption} from "./asset-types";
import {btoa, SelectOption} from "~/lib/helpers";

export const ASSET_CATEGORIES : AssetCategory[] = [{
	id: btoa('map'),
	singular: 'Map',
	plural: 'Maps'
}, {
	id: btoa('token'),
	singular: 'Token',
	plural: 'Tokens'
}, {
	id: btoa('portrait'),
	singular: 'Portrait',
	plural: 'Portraits'
}]

export const ASSET_TAGS : AssetTag[] = `Winter,Summer,Fall,Spring,Fantasy,Orc,Archer,Priest,Barbarian,Town,Village,Castle`
.split(',')
.sort()
.map((label: string) => {
	return {
		label: label,
		id: btoa(label.toLocaleLowerCase()),
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

export const AssetTypeOptions : AssetTypeOption[] = ASSET_CATEGORIES.map((type: AssetCategory) : AssetTypeOption => {
	return {
		value: type.id,
		label: type.plural
	}
})

export const AssetTypeOptionsSingular : AssetTypeOption[] = ASSET_CATEGORIES.map((type: AssetCategory) : AssetTypeOption => {
	return {
		value: type.id,
		label: type.singular
	}
})

export const AssetTagOptions : SelectOption[] = ASSET_TAGS.map((type: AssetTag) : SelectOption => {
	return {
		value: type.id,
		label: type.label
	}
})

export const ACCEPTED_IMAGE_TYPES = 'image/png, image/jpg, image/jpeg'
