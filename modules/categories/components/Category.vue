<template>
	<span class="category">{{name}}</span>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Prop} from "nuxt-property-decorator";
import {getCategoryById} from "~/lib/categories/categories-api";
import {Category as CategoryType} from "~/lib/categories/categories-types";

@Component
export default class Category extends Vue {
	@Prop() categoryId : string

	get category () : CategoryType | null {
		const cat = getCategoryById(this.categoryId)
		return cat
	}

	get name () : string {
		const cat = this.category
		if (!cat) {
			return 'N/A'
		}

		return cat.singular
	}
}
</script>
