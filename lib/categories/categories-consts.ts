import {Category} from "~/lib/categories/category-types";
import {SelectOption} from "~/lib/helpers";

export const CATEGORIES : Category[] = [{
	id: '605c5274fd919766fb2c58d2',
	singular: 'Map',
	plural: 'Maps'
}, {
	id: '605c56ce4a85250a96d4fd7d',
	singular: 'Token',
	plural: 'Tokens'
}, {
	id: '605c528209240a031ccc6f4d',
	singular: 'Portrait',
	plural: 'Portraits'
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
