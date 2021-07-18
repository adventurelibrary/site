import {CATEGORIES} from "~/modules/categories/categories-consts";
import {Category} from "~/modules/categories/categories-types";

export function getCategory(id: string) : (Category | null) {
	for (let i = 0; i < CATEGORIES.length; i++) {
		if (CATEGORIES[i].id == id) {
			return CATEGORIES[i]
		}
	}

	return null
}
