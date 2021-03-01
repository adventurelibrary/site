<template>
	<form @submit="submit" class="asset-search">
		<div class="query-container d-flex">
			<div class="search-filters">
				<SearchFilter
						v-for="(filter, idx) in searchFilters" :key="idx"
						:filter="filter"
						:active="idx == activeFilter"
						@remove="() => removeFilter(idx)"
				/>
			</div>
			<input placeholder="Search"
						type="text"
						v-model="query"
						@keypress.enter="enter"
						@keydown.up="selectPrevious"
						@keydown.left="selectPrevious"
						@keydown.right="selectNext"
						@keydown.down="selectNext"
			/>
		</div>
		<div v-show="showAdvanced" class="advanced-search">
			<div class="filter-container" v-show="action === 'type'">
				<label>Types</label>
				<TypeSelector
					:bus="bus"
          :filters="searchFilters"
					:query="trimmedQuery"
					:active="action === 'type'"
					@type:clicked="typeClicked" />
			</div>
			<div class="filter-container" v-show="action === 'tag'">
				<label>Tags</label>
				<TagSearch
					:bus="bus"
					:filters="searchFilters"
					:query="trimmedQuery"
					:active="action === 'tag'"
					@clickTag="tagClicked" />
			</div>
		</div>
		<div class="submit-container">
			<button>Submit</button>
		</div>
	</form>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Prop, Watch} from "nuxt-property-decorator"
import {AssetSearchOptions, AssetTag, AssetType} from "adventurelibrary/dist/assets/asset-types";
import TagSearch from "~/modules/tags/TagSearch.vue";
import {AssetSearchFilter, assetTypeToFilter, tagToFilter} from "adventurelibrary/dist/assets/search-filters";
import TypeSelector from "~/modules/assets/components/TypeSelector.vue";
import SearchFilter from "~/modules/assets/components/SearchFilter.vue";

const actions = ['tag', 'creator', 'type']

@Component({
	components: {
		TagSearch,
		TypeSelector,
		SearchFilter: SearchFilter,
	},
})
class AssetSearch extends Vue {
	showAdvanced : boolean = true
	searchFilters : AssetSearchFilter[] = []
	activeFilter : number = -1
	query : string = ''
	activeChild : string = ''
	bus : Vue = new Vue()

	@Prop() options : AssetSearchOptions

	enter (e : any) {
		if (e) {
			e.preventDefault()
		}
		console.log('enter!')
		this.bus.$emit('enter')
	}

	submit (e : any) {
		if (e) {
			e.preventDefault()
		}
		this.$emit('submit', this.searchFilters)
	}

	created () {
		this.bus.$on('submit', () => {
			console.log('a child component has said to submit')
		})
	}

	get action() : string | null {
		let trimmed = this.query.trim()
		for(let i = 0; i < actions.length; i++) {
			const action = actions[i]
			const prefix = action + ':'
			if (trimmed.toLowerCase().substr(0, prefix.length) === prefix) {
				return trimmed.substr(0, action.length)
			}
		}
		return null
	}

	get trimmedQuery() : string {
		const action = this.action
		if (action !== null) {
			return this.query.trim().substr(action.length+1).trim() // +1 for the :
		}

		return this.query
	}

	tagClicked (tag: AssetTag) {
		const filter = tagToFilter(tag)
		this.toggleFilter(filter)
	}

	// User has clicked on one of the types
	typeClicked (assetType: AssetType) {
		const filter = assetTypeToFilter(assetType)
		this.toggleFilter(filter)
	}

	toggleFilter (filter: AssetSearchFilter) {
		const idx = this.findFilter(filter)
		console.log('idx', idx)
		if (idx == -1) {
			this.addFilter(filter)
		} else {
			this.removeFilter(idx)
		}
	}

	addFilter (filter: AssetSearchFilter) {
		this.searchFilters.push(filter)
		this.query = ''
	}

	findFilter(filter: AssetSearchFilter) : number {
		return this.searchFilters.findIndex((sf: AssetSearchFilter) => {
			return sf.value == filter.value && sf.type == filter.type
		})
	}

	removeFilter (idx: number) {
		console.log('removing!')
		this.searchFilters.splice(idx, 1)
	}

	@Watch('query')
	queryWatch (newVal: string) {
		console.log('new val', newVal)
	}

	selectEvent (e : any, direction: string) {
		console.log('go ' + direction)
		if (e) {
			e.preventDefault()
		}
		this.bus.$emit(direction)
	}

	selectNext (e: any) {
		this.selectEvent(e, 'next')
	}

	selectPrevious (e: any) {
		// With no children active, this event is for filtering through this
		// parent componenent's lists of filters
		if (this.activeChild == '') {
			if (this.activeFilter == -1) {
				this.activeFilter = this.searchFilters.length - 1
			}
			return
		}
		this.selectEvent(e, 'prev')
	}
}
export default AssetSearch
</script>
<style>
.query-container input {
	padding: 0.5em;
}
.submit-container {
	padding-top: 1em;
}
.filter-container {
	margin-top: 0.5em;
	padding-top: 0.5em;
	border-top: 1px solid #ccc;
}
.filter-container > label {
	font-weight: bold;
}
</style>
