<template>
	<div>
		<a
				v-for="(type, idx) in items"
				:key="type.key"
				@click="() => { clickType(type) }"
				class="btn btn-sm mr-1"
				:class="{'btn-primary': activeItem === idx}"
		>
			{{type.plural}}
		</a>
	</div>
</template>
<script lang="ts">
import {Component, Watch} from "nuxt-property-decorator";
import {AssetType} from "adventurelibrary/dist/assets/asset-types";
import {AssetTypes} from "adventurelibrary/dist/assets/asset-consts";
import Vue from "vue";
import SearchArrowNavMixin from "~/mixins/SearchArrowNavMixin.vue";

@Component({
	mixins: [SearchArrowNavMixin]
})
export default class TypeSelector extends Vue {
	items : AssetType[] = AssetTypes

	@Watch('query')
	queryWatch () {
		if (!this.active) {
			return
		}
		console.log('query', this.query)
		for (let i = 0; i < this.items.length; i++) {
			const type = this.items[i]
			console.log('type', type)
			const searchIn = type.plural.toLowerCase()
			console.log('searchin', searchIn)
			if (searchIn.indexOf(this.query) >= 0) {
				console.log('FOUND IT', i, searchIn)
				this.activeItem = i;
				break;
			}
		}
	}


	created () {
		console.log('items', AssetTypes)
		this.activeItem = 0
	}

	clickType (type: AssetType) {
		this.$emit('type:clicked', type)
	}

	selectItem (idx: number) {
		this.clickType(this.items[idx])
	}
}
</script>
<style scoped="true">
</style>
