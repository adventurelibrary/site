<template>
	<ul class="action-list">
		<li class="action" v-for="(action, idx) in items"
				:key="action.key"
				:class="{'active': idx === activeItem}"
		>
			<a @click="() => clickAction(action)"
				class="d-block btn text-left mb-1"
			>
				<span class="action-prefix">{{action.prefix}}:</span>
				<span class="action-description">{{action.description}}</span>
			</a>
		</li>
	</ul>
</template>
<script lang="ts">
import {Component} from "nuxt-property-decorator";
import {AssetSearchAction} from "~/lib/assets/asset-types";
import {AssetSearchActions} from "~/lib/assets/asset-consts";
import SearchArrowNavMixin from "~/mixins/SearchArrowNavMixin.vue";

@Component({
	mixins: [SearchArrowNavMixin]
})
export default class SearchActions extends SearchArrowNavMixin {
	items : AssetSearchAction[] = AssetSearchActions

	created () {
		this.activeItem = -1
	}


	// The onPrev event for search actions works differently than the other search
	// child components
	// When you hit up arrow with an empty earch box it doesn't loop around
	// to the bottom option of this component
	// Instead it sets that it has no activeItem and then emits
	// an event to the parent component
	onPrev () {
		if (!this.active) {
			return
		}
		let newIdx = this.activeItem - 1
		// If we go below zero, just stay there
		if (this.activeItem < 0) {
			newIdx = -1
		}
		this.setActiveItem(newIdx)
		// When going beyond the possible options for previous, we let the parent
		// component know
		// This is so the search component can start highlight filters
		this.$emit('prevBeyond')
	}

	clickAction (type: AssetSearchAction) {
		this.$emit('action:clicked', type)
	}

	selectItem (idx: number) {
		this.clickAction(this.items[idx])
	}
}
</script>
<style scoped="true">
</style>
