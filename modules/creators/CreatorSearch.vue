<template>
	<div class="tag-search">
		<!--<ul class="action-list items" v-if="shownItems.length">-->
		<ul class="action-list items" v-if="true">
			<li
				:key="1"
				class="action"
				:class="{'active': activeItem === idx}"
				@click="() => clickCreator(1)">
				Creator 1
			</li>
			<li
				:key="2"
				class="action"
				:class="{'active': activeItem === idx}"
				@click="() => clickCreator(2)">
				Creator 2
			</li>
			<!--
			<li v-for="(tag, idx) in shownItems"
				:key="tag.key"
				class="action"
				:class="{'active': activeItem === idx}"
				@click="() => clickCreator(tag)">
				{{tag.label}}
			</li>-->
			<li>Creator 1</li>
			<li>Creator 2</li>
			<li>Creator 3</li>
			<li>Creator 4</li>

		</ul>
		<div v-else>
			<span v-if="query.length">Can't find any creators</span>
			<span v-else>Type to search for creators</span>
		</div>
	</div>
</template>
<script lang="ts">
import {Component, Watch, Prop} from "nuxt-property-decorator";
import {AssetTag} from "~/modules/assets/asset-types";
import {Creator} from "~/modules/creators/creator-types"
import SearchArrowNavMixin from "~/mixins/SearchArrowNavMixin.vue";
import api from "~/lib/api"

@Component({
	mixins: [SearchArrowNavMixin]
})
export default class CreatorSearch extends SearchArrowNavMixin {
	error : string = '';
	items : Creator[] = [];

	@Prop()
	exclude : string[];

	@Watch('query')
	queryWatch () {
		if (!this.active) {
			return
		}
		this.searchCreators()
	}

	async fetch() {
		console.log('fetch')
		const res = await api.get<JSON>(`/creatorssearchlist`)
		console.log('creatorSearch, fetch:', res)
		return res.data
    }

	// Featured tags are shown as suggestion when the user has only
	// typed in "creator:"
	// Right now it's just grabbing the first four, but in the future
	// we can prioritize based on which creators are most popular
	getFeaturedCreators () : Creator[] {
		/*
		  //API to return all creators from db: '/creators'

		  const total = await getTotalCreators()
			return {
				status: 200,
				body: {
				creators: rows,
				total: total
				}
			}
		*/




		const maxLen = Math.min(this.items.length, 4)
		return this.items.splice(0, maxLen)
	}



	async searchCreators () {
		// If query is blank we want to show suggestions
		if (this.query == '') {
			this.items = this.getFeaturedCreators()

			if (this.items.length == 0) {
				this.activeItem = -1
			} else {
				this.activeItem = 0
			}

			return
		}
		const query = this.query.toLowerCase()
		console.log('query', query)
		this.items = this.items.filter((creator: Creator) : boolean => {
			const nameMatch = creator.name.toLowerCase().indexOf(query) >= 0
			console.log('nameMatch', nameMatch)
			if (nameMatch) {
				return true
			}

			/* alias tag search //
			for (let i = 0; i < this.creator.aliases.length; i++) {
				const alias = creator.aliases[i]
				console.log('alias', alias)
				if (!alias) {
					continue
				}
				if (alias.toLowerCase().indexOf(query) >= 0) {
					return true
				}
			}
			*/

			return false
		})

		this.activeItem = 0
	}

	clickCreator(creator: Creator) {
		console.log('clickCreator')
		this.$emit('clickCreator', creator)
	}

	selectItem (idx: number) {
		this.clickCreator(this.shownItems[idx])
	}

	// The shown results are the filtered creators, which have been search through
	// MINUS the creators that are already in our list of filters
	get shownItems () : Creator[] {
		return this.items.filter((creator: Creator) => {
			for(let i = 0;i < this.filters.length; i++) {
				const f = this.filters[i]
				if (f.type === 'tag' && f.value === creator.id) {
					return false
				}
			}
			if (this.exclude.indexOf(creator.id) >= 0) {
				return false
			}
			return true
		})
	}
}
</script>
