<template>
	<ul class="action-list">
		<li class="action" v-for="(type, idx) in options" :key="type.key">
			<a @click="() => { clickType(type) }"
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

@Component({
	mixins: [SearchArrowNavMixin]
})
export default class TypeSelector extends SearchArrowNavMixin {
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

	clickType (type: AssetCategory) {
		this.$emit('type:clicked', type)
	}

	selectItem (idx: number) {
		this.clickType(this.items[idx])
	}
}
</script>
<style scoped="true">
</style>
