<template>
	<section class="container">
		<section class="hero">
			<AssetSearch :options="searchOptions" v-on:submit="submitSearch" />
		</section>
		<section class="featured-assets">
			<h3>Featured Assets!!! ({{numFeatured}})</h3>
			<div>
				<FeaturedAsset v-for="asset in featured" :asset="asset" :key="asset.slug" />
			</div>
		</section>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import {Component} from "nuxt-property-decorator";
import {Asset, AssetSearchOptions} from "~/lib/assets/asset-types";
import {getFeaturedAssets} from "~/lib/assets/asset-api";
import FeaturedAsset from "~/modules/assets/components/FeaturedAsset.vue";
import AssetSearch from "~/modules/assets/components/search/AssetSearch.vue";
import {assetSearchOptionsToQuery, newSearchOptions} from "~/lib/assets/asset-helpers";

@Component({
	components: {
		FeaturedAsset,
		AssetSearch,
	}
})
class HomePage extends Vue {
	public featured: Asset[]
	public numFeatured : number
	public searchOptions : AssetSearchOptions = newSearchOptions()

	async asyncData() {
		const assetsRes = await getFeaturedAssets()
		return {
			numFeatured: assetsRes.total,
			featured: assetsRes.results
		}
	}

	submitSearch (options: AssetSearchOptions) {
		this.$router.push({
			name: 'assets',
			query: assetSearchOptionsToQuery(options)
		})
	}
}

export default HomePage
</script>

<style>
.asset-search {
	margin: 1em;
	padding: 1em;
	border: 1px solid #ccc;
	background: #E0E0E0;
}

.hero {
	padding: 2em 0;
}

.hero .titles {
	text-align: center;
}

.titles h1 {
	font-size: 36px;
}

.titles h2 {
	font-size: 26px;
}

</style>
