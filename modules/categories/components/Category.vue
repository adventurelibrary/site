<template>
	<span class="category">{{name}}</span>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Prop} from "nuxt-property-decorator";
import {AssetCategory} from "~/lib/assets/asset-types";
import {getCategoryById} from "~/lib/categories/categories-api";

@Component
export default class Category extends Vue {
	@Prop() categoryId : string

	get category () : AssetCategory | null {
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
