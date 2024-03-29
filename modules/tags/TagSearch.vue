<template>
	<div class="search-typeahead-results tag-typeahead-results">
		<ul class="action-list items" v-if="shownItems.length">
			<li v-for="(tag, idx) in shownItems"
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
import {AssetTag} from "~/modules/assets/asset-types";
import SearchArrowNavMixin from "~/mixins/SearchArrowNavMixin.vue";
import {ASSET_TAGS} from "~/modules/tags/tags-consts";

@Component({
	mixins: [SearchArrowNavMixin]
})
export default class TagSearch extends SearchArrowNavMixin {
	error : string = '';
	items : AssetTag[] = [];

	@Prop()
	exclude : string[];

	@Watch('query', {
		immediate: true
	})
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
		const query = this.querySanitized
		// If query is blank we want to show suggestions
		if (!query) {
			this.items = this.getFeaturedTags()

			if (this.items.length == 0) {
				this.activeItem = -1
			} else {
				this.activeItem = 0
			}

			return
		}
		this.items = ASSET_TAGS.filter((tag: AssetTag) : boolean => {
			const lablMatch = tag.label.toLowerCase().indexOf(query) >= 0
			if (lablMatch) {
				return true
			}

			for (let i = 0; i < tag.aliases.length; i++) {
				const alias = tag.aliases[i]
				if (!alias) {
					continue
				}
				if (alias.toLowerCase().indexOf(query) >= 0) {
					return true
				}
			}

			return false
		})

		this.activeItem = 0
	}

	clickTag(tag: AssetTag) {
		this.$emit('clickTag', tag)
	}

	selectItem (idx: number) {
		this.clickTag(this.shownItems[idx])
	}

	// The shown results are the filtered tags, which have been search through
	// MINUS the tags that are already in our list of filters
	get shownItems () : AssetTag[] {
		let list = this.items.filter((tag: AssetTag) => {
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

		if (list.length > 15) {
			list = list.slice(0, 14)
		}

		return list
	}
}
</script>
