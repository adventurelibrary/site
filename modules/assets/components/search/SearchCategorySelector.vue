<template>
	<ul class="action-list">
		<li class="action" v-for="(type, idx) in options" :key="type.key">
			<a @click="() => { clickCategory(type) }"
				:class="{'btn-primary': activeItem === idx}"
			>
				{{type.plural}}
			</a>
		</li>
	</ul>
</template>
<script lang="ts">
import {Component, Watch} from "nuxt-property-decorator";
import SearchArrowNavMixin from "~/mixins/SearchArrowNavMixin.vue";
import {SelectOption} from "~/lib/helpers";
import {CategoryOptionsPlural} from "~/lib/categories/categories-consts";
import {Category} from "~/lib/categories/categories-types";

@Component({
	mixins: [SearchArrowNavMixin]
})
export default class SearchCategorySelector extends SearchArrowNavMixin {
	options : SelectOption[] = CategoryOptionsPlural

	@Watch('query')
	queryWatch () {
		if (!this.active) {
			return
		}
		for (let i = 0; i < this.items.length; i++) {
			const type = this.items[i]
			const searchIn = type.plural.toLowerCase()
			if (searchIn.indexOf(this.query) >= 0) {
				this.activeItem = i;
				break;
			}
		}
	}

	created () {
		this.activeItem = 0
	}

	clickCategory (type: Category) {
		this.$emit('category:clicked', type)
	}

	selectItem (idx: number) {
		this.clickCategory(this.items[idx])
	}
}
</script>
<style scoped="true">
</style>
