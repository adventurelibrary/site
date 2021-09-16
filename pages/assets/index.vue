<template>
	<div class="page-content search-page">
		<header class="page-header body-width">
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
			<section v-show="$fetchState.pending">
				<SignOfLife>Searching...</SignOfLife>
			</section>
			<section v-show="!$fetchState.pending">
				<div class="results-count body-width">
					Showing {{assets.length}} asset<span v-if="assets.length != 1">s</span> of {{totalAssets}}
				</div>
				<SelectAssetsContainer>
					<ul class="search-results">
						<AssetCard v-for="asset in assets" :key="asset.id" :asset="asset"></AssetCard>
					</ul>
				</SelectAssetsContainer>
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
import {Component, Getter, mixins, State, Watch} from "nuxt-property-decorator"
import AssetSearch from "~/modules/assets/components/search/AssetSearch.vue";
import {getRouteAssetSearchOptions} from "~/modules/assets/helpers";
import {Context} from "@nuxt/types";
import {Asset, AssetSearchOptions, AssetsResponse} from "~/modules/assets/asset-types";
import {assetSearchOptionsToQuery} from "~/modules/assets/asset-helpers";
import {searchAssets} from "~/modules/assets/asset-api";
import {Route} from "vue-router"
import AssetCard from "~/modules/assets/components/AssetCard.vue";
import PaginationMixin from "~/mixins/PaginationMixin.vue";
import {AssetSearchFilter} from "~/modules/assets/search-filters";
import {commaAndJoin, getElOffset} from "~/lib/helpers";
import SignOfLife from "~/components/SignOfLife.vue";
import SelectAssetsContainer from "~/modules/assets/components/select/SelectAssetsContainer.vue";
import LoggedInFetchMixin from "~/mixins/LoggedInFetchMixin.vue";

@Component({
	components: {
		AssetSearch,
		AssetCard,
		SelectAssetsContainer: SelectAssetsContainer,
		SignOfLife
	},
	mixins: [PaginationMixin]
})
class AssetsIndexPage extends mixins(LoggedInFetchMixin) {
	public search : AssetSearchOptions
	assetsResponse : AssetsResponse = {
		total: 0,
		assets: []
	}
	perPage = 20
	loadingMore = false
	scrollTimeout : number

	@State('assets', {
		namespace: 'assets'
	}) assets : Asset[]
	@State('shiftClickAnchorIndex', {
		namespace: 'assets'
	}) shiftAnchor : number
	@State('lastShiftClickedIndex', {
		namespace: 'assets'
	}) lastShift : number
	@Getter('assets/numSelectedAssets') numAssetsSelected : number

	head () {
		return {
			title: this.getPageTitle()
		}
	}

	async fetch () {
		this.assetsResponse = await searchAssets(this.search);
		this.$store.dispatch('assets/setAssets', this.assetsResponse.assets)
		this.$gtag.event('view_search_results', {
			'search_term': this.search.query
		})
		console.log('this store', this.$store.state)
	}

	mounted () {
		window.addEventListener('scroll', this.onScroll)
	}

	destroyed () {
		window.removeEventListener('scroll', this.onScroll)
		this.$store.dispatch('assets/clearAssets')
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
		this.$fetch()
	}

	async asyncData (ctx: Context) {
		const search = getRouteAssetSearchOptions(ctx.route)
		return {
			search: search,
		}
	}

	async loadMore ()	{
		const newFrom = this.search.from + this.search.size
		if (newFrom > this.assetsResponse.total) {
			return
		}

		this.loadingMore = true
		this.search.from = newFrom
		try {
			const res = await searchAssets(this.search)
			let current = this.assetsResponse.assets
			if (!current) {
				current = []
			}
			const newResults = current.concat(res.assets)
			if (this.assetsResponse) {
				Vue.set(this.assetsResponse, 'assets', newResults)
				this.$store.dispatch('assets/setAssets', this.assetsResponse.assets)
			} else {
				throw new Error('Cannot set new results on empty data')
			}
		} catch (ex) {
			this.notifyError(ex.toString())
		}
		this.loadingMore = false
	}

	get totalAssets () : number {
		return (this.assetsResponse.total || 0)
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
