<template>
	<span class="category">{{name}}</span>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Prop} from "nuxt-property-decorator";
import {getCategory} from "~/modules/categories/categories-api";
import {Category as CategoryType} from "~/modules/categories/categories-types";

@Component
export default class Category extends Vue {
	@Prop() category : string

	get categoryType () : CategoryType | null {
		const cat = getCategory(this.category)
		return cat
	}

	get name () : string {
		const cat = this.categoryType
		if (!cat) {
			return 'N/A'
		}

		return cat.singular
	}
}
</script>
