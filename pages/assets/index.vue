<template>
  <div class="container">
    <h1>Search Assets</h1>
    <div v-if="search">
      Search for: "{{search.query}}"
      <AssetSearch
				:options="search"
				v-on:submit="submit"
      />
    </div>
    <div>
      <div v-if="assetsAjax.loading">LOADING</div>
			<div v-else>
				Showing {{assets.length}} asset<span v-if="assets.length != 1">s</span>
				<AssetCard v-for="asset in assets" :key="asset.id" :asset="asset"></AssetCard>
			</div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Watch} from "nuxt-property-decorator"
import AssetSearch from "~/modules/assets/components/search/AssetSearch.vue";
import {getRouteAssetSearchOptions} from "~/modules/assets/helpers";
import {Context} from "@nuxt/types";
import {AssetSearchOptions, AssetsResponse} from "~/lib/assets/asset-types";
import {assetSearchOptionsToQuery} from "~/lib/assets/asset-helpers";
import {newAssetsAjax, searchAssets} from "~/lib/assets/asset-api";
import {Ajax, computeAjaxList, doAjax} from "~/lib/ajax";
import {Route} from "vue-router"
import AssetCard from "~/modules/assets/components/AssetCard.vue";
import PaginationMixin from "~/mixins/PaginationMixin.vue";
import {AssetSearchFilter} from "~/lib/assets/search-filters";
import {commaAndJoin} from "~/lib/helpers";

@Component({
  components: {
    AssetSearch,
		AssetCard,
  },
	mixins: [PaginationMixin]
})
class AssetsIndexPage extends Vue {
  public search : AssetSearchOptions
	assetsAjax : Ajax<AssetsResponse> = newAssetsAjax()

	paginationTo : any = {
  	name: 'assets',
		query: {}
	}

	head () {
  	return {
  		title: this.getPageTitle()
		}
	}

  async asyncData (ctx: Context) {
		const search = getRouteAssetSearchOptions(ctx.route)
		const fn = async () => {
			return await searchAssets(search)
		}
		const assetsAjax = newAssetsAjax()
		await doAjax<AssetsResponse>(assetsAjax, fn)
		return {
			search: search,
			assetsAjax
		}
  }

  get assets () : any[] {
  	return computeAjaxList(this.assetsAjax)
	}

	get totalAssets () : number {
  	if (!this.assetsAjax.data) {
  		return 0
		}
  	return this.assetsAjax.data.total || 0
	}

	getPageTitle () {
		let title = ''
		let searchingFor = 'Assets'

		if (this.search.filters.length) {
			let filters : string[] = this.search.filters.map((filter: AssetSearchFilter) => {
				return filter.type + ': ' + filter.label
			})
			searchingFor = commaAndJoin(filters)
		}

		if (this.search.query) {
			title = `"${this.search.query}" `
		}

		title += searchingFor
		return title
	}

  @Watch('$route')
	async routeChanged (newRoute: Route) {
		const search = getRouteAssetSearchOptions(newRoute)
		this.search = search
		const fn = async () => {
  		return await searchAssets(search)
		}
		await doAjax<AssetsResponse>(this.assetsAjax, fn)
		const t = this.getPageTitle()
	}

  submit (options: AssetSearchOptions) {
  	const query = assetSearchOptionsToQuery(options)
		this.$router.push({
			name: 'assets',
			query: query
		})
	}
}
export default AssetsIndexPage
</script>
