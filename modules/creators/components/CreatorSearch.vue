<template>
	<div class="search-typeahead-results creator">
		<ul class="action-list items" v-if="shownItems.length">
			<li v-for="(creator, idx) in shownItems"
					:key="creator.id"
					:slug="creator.slug"
					class="action"
					:class="{'active': activeItem === idx}"
					@click="() => clickCreator(creator)">
				{{creator.name}}
			</li>
		</ul>
		<div v-else>
			<span v-if="query.length">Can't find any creators</span>
			<span v-else>Type to search for creators</span>
		</div>
	</div>
</template>
<script lang="ts">
import {Component, Watch, Prop} from "nuxt-property-decorator";
import {Creator} from "~/modules/creators/creator-types"
import SearchArrowNavMixin from "~/mixins/SearchArrowNavMixin.vue";
import api from "~/lib/api"
import {getCreatorsCached} from "~/modules/creators/creator-api";
@Component({
	mixins: [SearchArrowNavMixin]
})
export default class CreatorSearch extends SearchArrowNavMixin {
	error : string = '';
	items : Creator[] = [];
	allCreators: Creator[] = []
	@Prop()
	exclude : string[];

	@Watch('query')
	queryWatch () {
		if (!this.active) {
			return
		}
		this.searchCreators()
	}

	async mounted () {
		this.allCreators = await getCreatorsCached()
	}

	// Featured creators are shown as suggestion when the user has only
	// typed in "creator:"
	// Right now it's just grabbing the first four, but in the future
	// we can prioritize based on which creators are most popular
	getFeaturedCreators () : Creator[] {
		//API to return all creators from db: '/creators'
		const maxLen = Math.min(this.allCreators.length, 4)
		return this.allCreators.slice(0, maxLen)
	}

	async fetch () {
		// We only need this list on the client side when a user starts searching for a creator:
		// in the SearchBar. So we don't bother doing this query in SSR, this saves load time
		if (process.server) {
			return
		}
		this.allCreators = await getCreatorsCached()
		this.searchCreators()
	}

	async searchCreators () {
		const query = this.querySanitized
		// If query is blank we want to show suggestions
		if (!query) {
			this.items = this.getFeaturedCreators()
			if (this.items.length == 0) {
				this.activeItem = -1
			} else {
				this.activeItem = 0
			}
			return
		}
		this.items = this.allCreators.filter((creator: Creator) : boolean => {
			const nameMatch = creator.name.toLowerCase().indexOf(query) >= 0
			if (nameMatch) {
				return true
			}
			const slugMatch = creator.slug.toLowerCase().indexOf(query) >= 0
			if (slugMatch) {
				return true
			}
			return false
		})
		this.activeItem = 0
	}
	clickCreator(creator: Creator) {
		this.$emit('clickCreator', creator)
	}
	selectItem (idx: number) {
		this.clickCreator(this.shownItems[idx])
	}
	// The shown results are the filtered creators, which have been search through
	// MINUS the creators that are already in our list of filters
	get shownItems () : Creator[] {
		const shown = this.items.filter((creator: Creator) => {
			for(let i = 0;i < this.filters.length; i++) {
				const f = this.filters[i]
				if (f.type === 'creator' && f.value === creator.slug) {
					return false
				}
			}
			if (this.exclude && this.exclude.indexOf(creator.id) >= 0) {
				return false
			}
			return true
		})
		return shown
	}
}
</script>
