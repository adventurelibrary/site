import {AssetSearchAction, AssetTag} from "./asset-types";
import {SelectOption} from "~/lib/helpers";

export const ASSET_TAGS : AssetTag[] = `Winter,Summer,Fall,Spring,Fantasy,Orc,Archer,Priest,Barbarian,Town,Village,Castle`
.split(',')
.sort()
.map((label: string) => {
	return {
		label: label,
		id: (label.toLocaleLowerCase()),
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

export const TagOptions : SelectOption[] = ASSET_TAGS.map((type: AssetTag) : SelectOption => {
	return {
		value: type.id,
		label: type.label
	}
})

export const ACCEPTED_IMAGE_TYPES = 'image/png, image/jpg, image/jpeg'
