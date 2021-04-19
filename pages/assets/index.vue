<template>
	<div class="page-content search-page">
		<header class="page-header">
			<h1>Search Assets</h1>
			<!--div v-if="search">
				Search for: "{{search.query}}"
				<AssetSearch
					:options="search"
					v-on:submit="submit"
				/>
			</div-->
		</header>
		<main class="page-body">
			<section v-if="assetsAjax.loading">LOADING</section>
			<section v-else>
				<h3 class="results-count">
					Showing {{assets.length}} asset<span v-if="assets.length != 1">s</span> of {{totalAssets}}
				</h3>
				<ul class="search-results">
					<AssetCard v-for="asset in assets" :key="asset.id" :asset="asset"></AssetCard>
				</ul>
				<div v-if="assets.length < totalAssets">
					<div v-if="loadingMore">Loading more...</div>
					<a v-else @click="loadMore">Load More</a>
				</div>
			</section>
		</main>
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
import {Ajax, computeAjaxList, computeAjaxTotal, doAjax} from "~/lib/ajax";
import {Route} from "vue-router"
import AssetCard from "~/modules/assets/components/AssetCard.vue";
import PaginationMixin from "~/mixins/PaginationMixin.vue";
import {AssetSearchFilter} from "~/lib/assets/search-filters";
import {commaAndJoin, getElOffset} from "~/lib/helpers";

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
	skip = 0
	perPage = 20
	loadingMore = false
	scrollTimeout : NodeJS.Timeout

	head () {
		return {
			title: this.getPageTitle()
		}
	}

	mounted () {
		window.addEventListener('scroll', this.onScroll)
	}

	destroyed () {
		window.removeEventListener('scroll', this.onScroll)
	}

	onScroll () {
		clearTimeout(this.scrollTimeout)
		this.scrollTimeout = setTimeout(async () => {
			const pos = window.scrollY
			const buffer = 100 // How many pixels from the bottom they need to scroll to
			const results = this.$el.querySelector('.search-results')
			if (!results) {
				return
			}
			const offset = getElOffset(results)
			const rect = results.getBoundingClientRect()
			const cutoff = offset.top + rect.height - buffer - window.innerHeight

			if (pos >= cutoff) {
				await this.loadMore()
			}
		}, 50)
	}

	@Watch('$route')
	async routeChanged (newRoute: Route) {
		const search = getRouteAssetSearchOptions(newRoute)
		this.search = search
		await this.loadSearch()
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

	async loadMore ()  {
		if (!this.assetsAjax.data || !this.assetsAjax.data.assets) {
			return
		}
		const newFrom = this.search.from + this.search.size
		if (newFrom > this.assetsAjax.data.total) {
			return
		}

		this.loadingMore = true
		this.search.from = newFrom
		try {
			const res = await searchAssets(this.search)
			let current = this.assetsAjax.data.assets
			if (!current) {
				current = []
			}
			const newResults = current.concat(res.assets)
			if (this.assetsAjax.data) {
				Vue.set(this.assetsAjax.data, 'assets', newResults)
			} else {
				throw new Error('Cannot set new results on empty data')
			}
		} catch (ex) {
			this.notifyError(ex.toString())
		}
		this.loadingMore = false
	}

	async loadSearch (skipLoading = false) {
		const fn = async () => {
			return await searchAssets(this.search)
		}
		await doAjax<AssetsResponse>(this.assetsAjax, fn, skipLoading)
		const t = this.getPageTitle()
		// TODO: Add some kind
		document.title = t
	}

	get assets () : any[] {
		return computeAjaxList(this.assetsAjax, 'assets')
	}

	get totalAssets () : number {
		return computeAjaxTotal(this.assetsAjax)
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
