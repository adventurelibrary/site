import {Category} from "~/modules/categories/categories-types";
import {SelectOption} from "~/lib/helpers";

export const CATEGORIES : Category[] = [{
	id: 'map',
	singular: 'Map',
	plural: 'Maps'
}, {
	id: 'token',
	singular: 'Token',
	plural: 'Tokens'
}, {
	id: 'scene',
	singular: 'Scene',
	plural: 'Scenes'
}, {
	id: 'panel',
	singular: 'Panel',
	plural: 'Panels'
}, {
	id: 'character',
	singular: 'Character',
	plural: 'Characters'
}, {
	id: 'item',
	singular: 'Item',
	plural: 'Items'
}]

export const CategoryOptionsPlural : SelectOption[] = CATEGORIES.map((type: Category) : SelectOption => {
	return {
		value: type.id,
		label: type.plural
	}
})

export const CategoryOptionsSingular : SelectOption[] = CATEGORIES.map((type: Category) : SelectOption => {
	return {
		value: type.id,
		label: type.singular
	}
})
