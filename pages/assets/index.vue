<template>
  <div class="container">
    <h1>Search Assets</h1>
    <div v-if="search">
      Search for: "{{search.query}}"
      <AssetSearch :options="search"
				v-on:submit="submit"
      />
    </div>
    <div>
      <Pagination :active-page="activePage" :to="paginationTo" :items-per-page="50" :total-items="totalAssets" />
    </div>
    <div>
      <div v-if="assetsAjax.loading">LOADING</div>
			<div v-else>
				Showing {{assets.length}} assets
				<AssetListing v-for="asset in assets" :key="asset.id" :asset="asset"></AssetListing>
			</div>
    </div>
    <div>
      Pagination here
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Watch} from "nuxt-property-decorator"
import AssetSearch from "~/modules/assets/components/AssetSearch.vue";
import {getAssetSearch} from "~/modules/assets/helpers";
import {Context} from "@nuxt/types";
import {AssetSearchOptions, AssetsResponse} from "adventurelibrary/dist/assets/asset-types";
import {assetSearchOptionsToQuery, typeKeysCommaList} from "adventurelibrary/dist/assets/asset-helpers";
import {newAssetsAjax, searchAssets} from "adventurelibrary/dist/assets/asset-api";
import {Ajax, computeAjaxList, doAjax} from "adventurelibrary/dist/ajax";
import {Route} from "vue-router"
import AssetListing from "~/modules/assets/components/AssetListing.vue";
import PaginationMixin from "~/mixins/PaginationMixin.vue";

@Component({
  components: {
    AssetSearch,
		AssetListing,
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
		const search = getAssetSearch(ctx.route)
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

		if (this.search.types.length) {
			searchingFor = typeKeysCommaList(this.search.types)
		}

		if (this.search.query) {
			title = `"${this.search.query}" `
		}

		title += searchingFor
		return title
	}

  @Watch('$route')
	async routeChanged (newRoute: Route) {
		const search = getAssetSearch(newRoute)
		this.search = search
		const fn = async () => {
  		return await searchAssets(search)
		}
		await doAjax<AssetsResponse>(this.assetsAjax, fn)
		const t = this.getPageTitle()
	}

  submit (options: AssetSearchOptions) {
		this.$router.push({
			name: 'assets',
			query: assetSearchOptionsToQuery(options)
		})
	}
}
export default AssetsIndexPage
</script>