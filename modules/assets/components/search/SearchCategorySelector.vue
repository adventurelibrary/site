<template>
	<ul class="action-list">
		<li class="action" v-for="(category, idx) in items" :key="category.key"
			:class="{active: activeItem == idx}"
		>
			<a @click="() => { clickCategory(category) }">
				{{category.plural}}
			</a>
		</li>
	</ul>
</template>
<script lang="ts">
import {Component, Watch} from "nuxt-property-decorator";
import SearchArrowNavMixin from "~/mixins/SearchArrowNavMixin.vue";
import {SelectOption} from "~/lib/helpers";
import {CATEGORIES, CategoryOptionsPlural} from "~/lib/categories/categories-consts";
import {Category} from "~/lib/categories/categories-types";

@Component({
	mixins: [SearchArrowNavMixin]
})
export default class SearchCategorySelector extends SearchArrowNavMixin {
	items : Category[] = CATEGORIES

	@Watch('query')
	queryWatch () {
		if (!this.active) {
			return
		}
		for (let i = 0; i < this.items.length; i++) {
			const category = this.items[i]
			const searchIn = category.plural.toLowerCase()
			if (searchIn.indexOf(this.query) >= 0) {
				this.activeItem = i;
				break;
			}
		}
	}

	created () {
		this.activeItem = 0
	}

	clickCategory (cat: Category) {
		this.$emit('category:clicked', cat)
	}

	selectItem (idx: number) {
		this.clickCategory(this.items[idx])
	}
}
</script>
<style scoped="true">
</style>
