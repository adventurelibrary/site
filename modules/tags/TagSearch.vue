<template>
	<div class="tag-search">
		<ul class="action-list items" v-if="shownResults.length">
			<li v-for="(tag, idx) in shownResults"
				:key="tag.key"
				class="action"
				:class="{'active': activeItem === idx}"
				@click="() => clickTag(tag)">
				{{tag.label}}
			</li>
		</ul>
		<div v-else>
			<span v-if="query.length">Can't find any tags</span>
			<span v-else>Type to search for tags</span>
		</div>
	</div>
</template>
<script lang="ts">
import {Component, Watch, Prop} from "nuxt-property-decorator";
import {AssetTag} from "~/lib/assets/asset-types";
import SearchArrowNavMixin from "~/mixins/SearchArrowNavMixin.vue";
import {ASSET_TAGS} from "~/lib/tags/tags-consts";

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
		const clone = ASSET_TAGS.slice()
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
		this.items = ASSET_TAGS.filter((tag: AssetTag) : boolean => {
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
				if (f.type === 'tag' && f.value === tag.id) {
					return false
				}
			}
			if (this.exclude.indexOf(tag.id) >= 0) {
				return false
			}
			return true
		})
	}
}
</script>
