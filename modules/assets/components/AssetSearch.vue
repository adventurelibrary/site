<template>
  <form @submit="submit" class="asset-search">
    <div class="query-container">
      <input placeholder="Search" type="text" v-model="query" @change="changeSearch" @keypress.enter="submit" />
    </div>
    <div>
      <Checklist :options="typeOptions" :checked="types" v-on:changed="typesChanged" />
    </div>
		<div>
			<button>Submit</button>
		</div>
  </form>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Prop} from "nuxt-property-decorator"
import {AssetSearchOptions} from "adventurelibrary/dist/assets/asset-types";
import {AssetTypeOptions} from "adventurelibrary/dist/assets/asset-consts";
import Checklist from "~/components/Checklist.vue";
import {keyBoolToArray} from "adventurelibrary/dist/helpers";

@Component({
  components: {
    Checklist: Checklist
  }
})
class AssetSearch extends Vue {
  query : string = ''
	types : string[] = []

	@Prop() options : AssetSearchOptions

  data () {
    return {
      query: this.options.query,
      types: this.options.types,
      typeOptions: AssetTypeOptions
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

  changeSearch (e: any) {
    this.$emit('changed', this.getSearchOptions())
  }
}
export default AssetSearch
</script>
