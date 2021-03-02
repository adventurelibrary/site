<template>
	<form @submit="submit" class="asset-search">
		<div v-if="true">
			<pre>
Filters: {{searchFilters}}
Active Filter: {{activeFilter}}
Action: {{action}}
Show Actions: {{showActions}}
			</pre>
		</div>
		<div class="query-container d-flex">
			<div class="search-filters">
				<SearchFilter
						v-for="(filter, idx) in searchFilters" :key="idx"
						:filter="filter"
						:active="idx === activeFilter"
						@remove="() => removeFilter(idx)"
				/>
			</div>
			<input placeholder="Search"
						type="text"
						v-model="query"
						role="query"
						@keypress.enter="enter"
						@keydown.up="keyUpLeftArrow"
						@keydown.left="keyUpLeftArrow"
						@keydown.right="keyDownRightArrow"
						@keydown.down="keyDownRightArrow"
						@keydown.delete="deleteKey"
			/>
		</div>
		<div v-show="showAdvanced" class="actions">
			<div class="filter-container" v-show="showActions">
				<SearchActions
					:bus="bus"
					:filters="searchFilters"
					:query="trimmedQuery"
					:active="showActions"
					@action:clicked="actionClicked"
					@prevBeyond="selectPreviousFilter"
				/>
			</div>
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
import {AssetSearchAction, AssetSearchOptions, AssetTag, AssetType} from "adventurelibrary/dist/assets/asset-types";
import TagSearch from "~/modules/tags/TagSearch.vue";
import {AssetSearchFilter, assetTypeToFilter, tagToFilter} from "adventurelibrary/dist/assets/search-filters";
import TypeSelector from "~/modules/assets/components/search/TypeSelector.vue";
import SearchFilter from "~/modules/assets/components/search/SearchFilter.vue";
import SearchActions from "~/modules/assets/components/search/SearchActions.vue";

const actions = ['tag', 'creator', 'type']

@Component({
	components: {
		TagSearch,
		TypeSelector,
		SearchFilter: SearchFilter,
		SearchActions: SearchActions,
	},
})
class AssetSearch extends Vue {
	showAdvanced : boolean = true
	searchFilters : AssetSearchFilter[] = [{
		type: 'tag',
		label: 'Winter',
		value: 'winter'
	}, {
		type: 'tag',
		label: 'Summer',
		value: 'summer'
	}, {
		type: 'type',
		label: 'Map',
		value: 'map'
	}]
	activeFilter : number = -1
	query : string = ''
	bus : Vue = new Vue()

	// The index of the active highlighted item from the child component
	activeChildActiveItem : number

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

		// Child components can pass up their active item index
		// as the user cycles through them with their keyboard
		// We generally don't care about this in the parent component,
		// because we just let the child component cycle through its
		// options however it wants
		// One exception is when we have the SearchActions open and the
		// user hits the up arrow, we want that to start highlighting filters
		// if there are any, instead of looping back down to the last
		// child option
		this.bus.$on('setActiveItem', (idx: number) => {
			this.activeChildActiveItem = idx
		})
	}

	get showActions () : boolean {
		return this.query.length === 0
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

	actionClicked (action: AssetSearchAction) {
		console.log('action', action)
		this.query = action.prefix + ':'
		this.focusInput()
	}

	tagClicked (tag: AssetTag) {
		console.log('tag', tag)
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
		if (idx == -1) {
			this.addFilter(filter)
		} else {
			this.removeFilter(idx)
		}
	}

	focusInput () {
		const input = this.$el.querySelector<HTMLInputElement>('input[role=query]')
		if (input) {
			input.focus()
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
		console.log('removing!', idx)
		this.searchFilters.splice(idx, 1)
	}

	@Watch('query')
	queryWatch (newVal: string) {
		console.log('new val', newVal)

		// When they start typing something, we deselect the filter
		// that might've been highlighted by keyboard controls
		if (this.query.length) {
			this.activeFilter = -1
		}
	}

	deleteKey (e : any) {
		// If they're typing then delete and backspace work as normal
		if (this.query.length > 0) {
			return
		}

		// If you hit backspace with an empty text box while you have
		// filters in your list, this will select the most recent filter
		// as the active one
		// This allows you to hit backspace a bunch of times to delete all your filters
		if (this.activeFilter == -1 && this.searchFilters.length) {
			e.preventDefault()
			this.activeFilter = this.searchFilters.length - 1
			return
		}

		// If they have an active search filter then we're deleting that one
		if (this.activeFilter >= 0) {
			e.preventDefault()
			this.searchFilters.splice(this.activeFilter, 1)
			this.activeFilter = -1
		}
	}

	keyDownRightArrow (e: any) {
		e.preventDefault()
		// With no children active, this event is for filtering through this
		// parent componenent's lists of filters
		if (!this.action && this.activeFilter >= 0) {
			console.log('select next')
			this.selectNextFilter()
			return
		}
		console.log('emit next')
		this.bus.$emit('next')
	}

	keyUpLeftArrow (e: any) {
		e.preventDefault()
		// With no children active, this event is for filtering through this
		// parent componenent's lists of filters
		if (!this.action) {
			this.selectPreviousFilter()
			return
		}
		this.bus.$emit('prev')
	}

	selectAdjacentFilter (direction : 1 | -1) {
		this.activeFilter += direction
		if (this.activeFilter <= -1) {
			this.activeFilter = this.searchFilters.length - 1
		} else if (this.activeFilter >= this.searchFilters.length) {
			this.activeFilter = 0
		}
	}

	selectNextFilter () {
		this.selectAdjacentFilter(1)
	}

	selectPreviousFilter () {
		this.selectAdjacentFilter(-1)
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
