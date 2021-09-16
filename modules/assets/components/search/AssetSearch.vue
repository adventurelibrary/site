<template>
	<form @submit="submit" class="asset-search">
		<button class="search-trigger">
			<img src="~/assets/coolicons/svg/edit/search.svg" alt="Search Now">
		</button>
		<ul class="search-filters">
			<SearchFilter
				v-for="(filter, idx) in searchFilters" :key="idx"
				:filter="filter"
				:active="idx === activeFilter"
				@remove="() => removeFilter(idx)"
			/>
		</ul>
		<input placeholder="Search"
			class="search-input"
			type="text"
			v-model="query"
			role="query"
			@keypress.enter="enter"
			@keydown.up="keyUpArrow"
			@keydown.down="keyDownArrow"
			@keydown.delete="deleteKey"
			@keydown.tab="tabKey"
			@focus="onInputFocus"
			@blur="onInputBlur"
		/>
		<figure class="order-select" title="Sort Order">
			<button class="ascend"
				@click="sortDirection = 'asc'">
				<i class="ci-chevron_big_up"></i>
			</button>
			<button class="descend"
				@click="sortDirection = 'desc'">
				<i class="ci-chevron_big_down"></i>
			</button>
		</figure>
		<select v-model="sortField" class="filter-select sort-select">
			<option :value="'name'">Name</option>
			<option :value="'date'">Date</option>
		</select>

		<div v-show="showDropdown" class="actions">
			<div class="filter-container" v-show="showActionSuggestions">
				<h3>Filter Options</h3>
				<SearchActions
					:bus="bus"
					:filters="searchFilters"
					:query="actionQuery"
					:active="showActionSuggestions"
					@action:clicked="actionClicked"
				/>
			</div>
			<div class="filter-container" v-show="action === 'category'">
				<h3>Categories</h3>
				<CategorySelector
					:bus="bus"
					:filters="searchFilters"
					:query="actionQuery"
					:active="action === 'category'"
					@category:clicked="categoryClicked" />
			</div>
			<div class="filter-container" v-show="action === 'tag'">
				<h3>Tags</h3>
				<TagSearch
					:bus="bus"
					:filters="[]"
					:exclude="excludedTags"
					:query="actionQuery"
					:active="action === 'tag'"
					@clickTag="tagClicked" />
			</div>
			<div class="filter-container" v-show="action === 'creator'">
				<h3>Creators</h3>
				<CreatorSearch
						:bus="bus"
						:filters="searchFilters"
						:query="actionQuery"
						:active="action === 'creator'"
						@clickCreator="creatorClicked" />
			</div>
		</div>
		<!-- This is here for easier debugging. It will be removed before launch. -->
		<div v-if="false">
			<pre>
Filters: {{searchFilters}}
Active Filter: {{activeFilter}}
Action: {{action}}
Action Query: {{actionQuery}}
Show Actions: {{showActionSuggestions}}
			</pre>
		</div>
	</form>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Prop, Watch} from "nuxt-property-decorator"
import {AssetSearchAction, AssetSearchOptions, AssetTag} from "~/modules/assets/asset-types";
import TagSearch from "~/modules/tags/TagSearch.vue";
import {AssetSearchFilter, assetCategoryToFilter, tagToFilter, creatorToFilter} from "~/modules/assets/search-filters";
import SearchCategorySelector from "~/modules/assets/components/search/SearchCategorySelector.vue";
import SearchFilter from "~/modules/assets/components/search/SearchFilter.vue";
import SearchActions from "~/modules/assets/components/search/SearchActions.vue";
import {newSearchOptions, stringToSortDirection} from "~/modules/assets/asset-helpers";
import {Category} from "~/modules/categories/categories-types";
import {Creator} from "~/modules/creators/creator-types";
import CreatorSearch from "~/modules/creators/components/CreatorSearch.vue";

const actions = ['category', 'creator', 'tag']

@Component({
	components: {
		TagSearch,
		CreatorSearch: CreatorSearch,
		CategorySelector: SearchCategorySelector,
		SearchFilter: SearchFilter,
		SearchActions: SearchActions,
	},
})
class AssetSearch extends Vue {
	searchFilters : AssetSearchFilter[] = []
	activeFilter : number = -1
	query : string = ''
	sortField : string;
	sortDirection : string;
	bus : Vue = new Vue()
	inputFocused = false;
	inputFocusTimeout : NodeJS.Timeout

	// The index of the active highlighted item from the child component
	activeChildActiveItem : number

	@Prop({
		default: newSearchOptions
	}) options : AssetSearchOptions

	enter (e : any) {
		if (e) {
			e.preventDefault()
		}

		if (this.action === null) {
			if (this.query.length > 0) {
				this.emitSubmit()
			}
		}

		this.bus.$emit('enter')
	}

	// Our submit just emits the filters up
	// Whichever page is using this component can decide what to do with them
	// EG: redirect to a new page, do a query on the page
	submit (e : any) {
		if (e) {
			e.preventDefault()
		}
		this.emitSubmit()
	}

	emitSubmit () {
		this.$emit('submit', this.getSearchOptions())
	}

	getSearchOptions () : AssetSearchOptions {
		// TODO: Figure out if from/size are set here. They might be set in the parent component
		return {
			query: this.query.trim(),
			filters: this.searchFilters,
			sortField: this.sortField,
			sortDirection: stringToSortDirection(this.sortDirection),
			from: 0,
			size: 0
		}
	}

	created () {
		if (!this.options) {
			return
		}
		this.searchFilters = this.options.filters
		this.query = this.options.query
		this.sortField = this.options.sortField
		this.sortDirection = this.options.sortDirection

		this.bus.$on('submit', () => {
			this.emitSubmit()
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

	mounted () {
		this.$root.$on('addCategoryToSearch', this.onAddCategoryToSearch);
		this.$root.$on('addTagToSearch', this.onAddTagToSearch);
	}

	onAddTagToSearch(tag: AssetTag) {
		this.tagClicked(tag)
	}

	onAddCategoryToSearch(cat: Category) {

		this.categoryClicked(cat)
	}

	get showDropdown () : boolean {
		return this.inputFocused && (this.showActionSuggestions || this.action !== null)
	}

	get showActionSuggestions () : boolean {
		return this.action === null
	}

	get action() : string | null {
		let trimmed = this.query.trim()
		for(let i = 0; i < actions.length; i++) {
			const action = actions[i]
			const prefix = action + ':'

			if (trimmed.match(new RegExp('\\s' + prefix))) {
				return action
			}

			if (trimmed.toLowerCase().substr(0, prefix.length) === prefix) {
				return trimmed.substr(0, action.length)
			}
		}
		return null
	}

	get actionQuery() : string {
		const action = this.action
		if (action !== null) {
			const prefixStart = this.query.indexOf(action + ':')
			const query = this.query.substr(prefixStart + action.length + 1)
			return query
		}

		return this.query
	}

	get excludedTags () : string[] {
		const tags : string[] = []
		this.searchFilters.forEach((sf) => {
			if (sf.type === 'tag') {
				tags.push(sf.value)
			}
		})

		return tags;
	}

	actionClicked (action: AssetSearchAction) {
		this.query = action.prefix + ':'
		this.focusInput()
	}

	onInputFocus () {
		clearTimeout(this.inputFocusTimeout)
		this.inputFocused = true
	}

	onInputBlur () {
		this.inputFocusTimeout = setTimeout(() => {
			this.inputFocused = false
		}, 100)
	}

	tagClicked (tag: AssetTag) {
		const filter = tagToFilter(tag)
		this.toggleFilter(filter)
	}

	// User has clicked on one of the types
	categoryClicked (cat: Category) {
		if (!cat) {
			throw new Error('Bad category')
		}
		const filter = assetCategoryToFilter(cat)
		this.toggleFilter(filter)
	}

	creatorClicked (creator: Creator) {
		if (!creator) {
			console.error(`Falsy creator clicked`)
			return
		}
		const filter = creatorToFilter(creator)
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

	/*addTextFilter () {
		const query = this.query.trim()
		this.searchFilters.push({
			type: 'query',
			value: query
		})
	}*/

	addFilter (filter: AssetSearchFilter) {
		this.searchFilters.push(filter)
		const find = filter.type + ':'
		const idx = this.query.indexOf(find)
		this.query = this.query.substr(0, idx-1)
	}

	findFilter(filter: AssetSearchFilter) : number {
		return this.searchFilters.findIndex((sf: AssetSearchFilter) => {
			return sf.value == filter.value && sf.type == filter.type
		})
	}

	removeFilter (idx: number) {
		this.searchFilters.splice(idx, 1)
	}

	@Watch('query')
	queryWatch () {
		// When they start typing something, we deselect the filter
		// that might've been highlighted by keyboard controls
		if (this.query.length) {
			this.activeFilter = -1
		}
	}

	tabKey (e: any) {
		e.preventDefault()
		this.emitTab(e)
		return
	}

	deleteKey (e : any) {
		// If they're typing then delete and backspace work as normal
		if (this.query.length > 0 && this.activeFilter == -1) {

			// Except if they are at the start of the input box AND have filters, then we want backspace
			// to select their most recent item
			if (e.target.selectionStart == 0 && this.searchFilters.length) {
				this.activeFilter = this.searchFilters.length - 1
			}
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
			Vue.delete(this.searchFilters, this.activeFilter)
			if (this.activeFilter >= this.searchFilters.length) {
				this.activeFilter = -1
			}
		}
	}

	emitClearSelection () {
		this.bus.$emit('clearSelection')
	}

	emitTab (e: any) {
		this.bus.$emit('tab', e)
	}

	emitNext () {
		this.bus.$emit('next')
	}

	emitPrev () {
		this.bus.$emit('prev')
	}

	keyDownArrow (e: any) {
		e.preventDefault()
		// With no children active, this event is for filtering through this
		// parent componenent's lists of filters
		if (!this.action && this.activeFilter >= 0) {
			this.selectNextFilter()
			return
		}
		if (this.action && this.activeChildActiveItem >= 0) {
			this.emitNext()
			return
		}
		this.activeFilter = -1
		this.emitNext()
	}

	keyUpArrow (e: any) {
		e.preventDefault()

		if (!this.action) {
			if (this.activeChildActiveItem > 0) {
				this.emitPrev()
				return
			}
			if (this.activeChildActiveItem == 0) {
				this.emitClearSelection()
				return
			}
			this.selectPreviousFilter()
			return
		}
		this.emitPrev()
	}

	selectAdjacentFilter (direction : 1 | -1) {
		this.activeFilter += direction
		if (this.activeFilter <= -1) {
			this.activeFilter = 0
		} else if (this.activeFilter >= this.searchFilters.length) {
			this.activeFilter = -1
		}
	}

	selectNextFilter () {
		this.selectAdjacentFilter(1)
	}

	selectPreviousFilter () {
		if (this.activeFilter == -1) {
			this.activeFilter = this.searchFilters.length - 1
			return
		}
		this.selectAdjacentFilter(-1)
	}
}
export default AssetSearch
</script>
