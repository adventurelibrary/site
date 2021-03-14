<template>
	<div class="tag-search">
		<div v-if="shownResults.length == 0">
			<div v-if="query.length">Can't find any tags</div>
			<div v-else>Type to search for tags</div>
		</div>
		<div class="items">
			<div v-for="(tag, idx) in shownResults"
				:key="tag.key"
				class="btn"
				:class="{'btn-primary': activeItem === idx}"
				@click="() => clickTag(tag)">
				{{tag.label}}
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import {Component, Watch, Prop} from "nuxt-property-decorator";
import {AssetTag} from "~/lib/assets/asset-types";
import SearchArrowNavMixin from "~/mixins/SearchArrowNavMixin.vue";
import {AssetTags} from "~/lib/assets/asset-consts";

@Component({
	mixins: [SearchArrowNavMixin]
})
export default class TagSearch extends SearchArrowNavMixin {
	error : string = '';
	items : AssetTag[] = [];

	@Prop()
	exclude : string[];

	@Watch('query')
	queryWatch () {
		if (!this.active) {
			return
		}
		this.searchTags()
	}

	// Featured tags are shown as suggestiosn when the user has only
	// typed in "tag:"
	// Right now it's just grabbing the first four, but in the future
	// we can prioritize based on which tags are most popular
	getFeaturedTags () : AssetTag[] {
		const clone = AssetTags.slice()
		const maxLen = Math.min(clone.length, 4)
		return clone.splice(0, maxLen)
	}

	async searchTags () {
		// If query is blank we want to show suggestions
		if (this.query == '') {
			this.items = this.getFeaturedTags()

			if (this.items.length == 0) {
				this.activeItem = -1
			} else {
				this.activeItem = 0
			}

			return
		}
		this.items = AssetTags.filter((tag: AssetTag) : boolean => {
			return tag.label.toLowerCase().indexOf(this.query.toLowerCase()) >= 0
		})

		this.activeItem = 0
	}

	clickTag(tag: AssetTag) {
		this.$emit('clickTag', tag)
	}

	selectItem (idx: number) {
		this.clickTag(this.shownResults[idx])
	}

	// The shown results are the filtered tags, which have been search through
	// MINUS the tags that are already in our list of filters
	get shownResults () : AssetTag[] {
		return this.items.filter((tag: AssetTag) => {
			for(let i = 0;i < this.filters.length; i++) {
				const f = this.filters[i]
				if (f.type === 'tag' && f.value === tag.key) {
					return false
				}
			}
			if (this.exclude.indexOf(tag.key) >= 0) {
				return false
			}
			return true
		})
	}
}
</script>
