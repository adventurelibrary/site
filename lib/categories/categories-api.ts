import {CATEGORIES} from "~/lib/categories/categories-consts";
import {Category} from "~/lib/categories/categories-types";

export function getCategoryById(id: string) : (Category | null) {
	for (let i = 0; i < CATEGORIES.length; i++) {
		if (CATEGORIES[i].id == id) {
			return CATEGORIES[i]
		}
	}

	return null
}
