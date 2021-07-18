<template>
	<ul class="action-list">
		<li class="action" v-for="(action, idx) in shownActions"
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
import {AssetSearchAction} from "~/modules/assets/asset-types";
import {AssetSearchActions} from "~/modules/assets/asset-consts";
import SearchArrowNavMixin from "~/mixins/SearchArrowNavMixin.vue";

@Component({
	mixins: [SearchArrowNavMixin]
})
export default class SearchActions extends SearchArrowNavMixin {
	items : AssetSearchAction[] = AssetSearchActions

	created () {
		this.activeItem = -1
	}

	get shownActions () : AssetSearchAction[] {
		if (!this.query.length) {
			return this.items
		}
		return this.items.filter((action: AssetSearchAction) => {
			if (action.key.indexOf(this.query) >= 0) {
				return true
			}
			return false
		})
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

	onTab (e: any) {
		if (!this.active) {
			return
		}

		if (this.activeItem < 0 && this.shownActions.length > 0) {
			e.preventDefault()
			this.clickAction(this.shownActions[0])
			return
		}

		if (this.activeItem >= 0) {
			e.preventDefault()
			console.log('active item', this.activeItem)
			this.selectItem(this.activeItem)
			return
		}

	}

	clickAction (type: AssetSearchAction) {
		this.$emit('action:clicked', type)
	}

	selectItem (idx: number) {
		this.clickAction(this.shownActions[idx])
	}
}
</script>
<style scoped="true">
</style>
