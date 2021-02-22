<template>
  <form @submit="submit" class="asset-search">
    <div class="query-container">
      <input placeholder="Search" type="text" v-model="query" @change="changeSearch" @keypress.enter="submit" />
			<a style="" @click="showAdvanced = !showAdvanced">Advanced Search</a>
		</div>
		<div v-show="showAdvanced" class="advanced-search">
			<div class="filter-container">
				<label>Types</label>
				<Checklist :options="typeOptions" :checked="types" v-on:changed="typesChanged" classes="inline" />
			</div>
			<div class="filter-container">
				<label>Tags</label>
				<div>{{existingTags}}</div>
				<div>{{selectedTags}}</div>
				<TagSearch v-model="selectedTags" :existing-tags="existingTags" :typeahead="true" />
			</div>
		</div>
		<div class="submit-container">
			<button>Submit</button>
		</div>
  </form>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Prop} from "nuxt-property-decorator"
import {AssetSearchOptions} from "adventurelibrary/dist/assets/asset-types";
import {AssetTagOptions, AssetTags, AssetTypeOptions} from "adventurelibrary/dist/assets/asset-consts";
import Checklist from "~/components/Checklist.vue";
import TagSearch from "~/components/TagsSearch.vue"

@Component({
  components: {
    Checklist: Checklist,
		TagSearch,
  }
})
class AssetSearch extends Vue {
  query : string = ''
	types : string[] = []
	tags : string[] = []
	showAdvanced : boolean = true
	existingTags : any[] = [
		{key: 'winter', value: 'Winter'}
	]
	selectedTags : any[] = []

	@Prop() options : AssetSearchOptions

  data () {
    return {
      query: this.options.query,
			types: this.options.types,
			tags: this.options.tags,
			typeOptions: AssetTypeOptions,
			tagOptions: AssetTagOptions
    }
  }

	getSearchOptions () {
    return {
      query: this.query,
			types: this.types,
    }
  }

  submit (e : any) {
  	if (e) {
  		e.preventDefault()
		}
    this.$emit('submit', this.getSearchOptions())
  }

	typesChanged (checked : string[]) {
		this.types = checked
	}

	tagsChanged (checked : string[]) {
		this.tags = checked
	}

  changeSearch (e: any) {
    this.$emit('changed', this.getSearchOptions())
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
