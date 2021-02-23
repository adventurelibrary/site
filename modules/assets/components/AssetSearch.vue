<template>
  <form @submit="submit" class="asset-search">
    <div class="query-container">
      <input placeholder="Search" type="text" v-model="query" @change="changeSearch" @keypress.enter="submit" />
			<a style="" @click="showAdvanced = !showAdvanced">Advanced Search</a>
		</div>
		<div v-show="showAdvanced" class="advanced-search">
			<div class="filter-container" :class="{active: activeChild === 'type'}">
        <TypeSearch :query="trimmedQuery" @click="typeClicked" />
      </div>
      <div class="filter-container" :class="{active: activeChild === 'tag'}">
        <TagSearch :query="trimmedQuery" @clickTag="tagClicked" />
      </div>
		</div>
    <div class="search-filters">
      <SearchFilter
        v-for="(filter, idx) in searchFilters" :key="idx"
        :filter="filter"
        @click="() => removeFilter(idx)"
      />
    </div>
		<div class="submit-container">
			<button>Submit</button>
		</div>
  </form>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Prop} from "nuxt-property-decorator"
import {AssetSearchOptions, AssetTag, AssetType} from "adventurelibrary/dist/assets/asset-types";
import Checklist from "~/components/Checklist.vue";
import TagSearch from "~/modules/tags/TagSearch.vue";
import {AssetSearchFilter} from "adventurelibrary/dist/assets/search-filters";

@Component({
  components: {
    TagSearch,
    Checklist: Checklist,
  },
})
class AssetSearch extends Vue {
	showAdvanced : boolean = true
  searchFilters : AssetSearchFilter[] = []
  query : string = ''
	activeChild : string = ''

	@Prop() options : AssetSearchOptions

  submit (e : any) {
    if (e) {
      e.preventDefault()
		}
    this.$emit('submit', this.searchFilters)
  }

  get trimmedQuery() : string {
    return this.query
  }

  tagClicked (tag: AssetTag) {
    console.log('tag', tag)
  }

  typeClicked (assetType: AssetType) {
		console.log('asset type', assetType)
  }

	removeFilter (idx: number) {
		this.searchFilters.splice(idx, 1)
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
