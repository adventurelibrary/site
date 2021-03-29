<template>
	<section class="container">
		<section class="featured-assets">
			<h3>Featured Assets</h3>
			<ul class="search-results">
				<AssetCard v-for="asset in featured" :asset="asset" :key="asset.slug" />
			</ul>
		</section>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import {Component} from "nuxt-property-decorator";
import {Asset, AssetSearchOptions} from "~/lib/assets/asset-types";
import {getFeaturedAssets} from "~/lib/assets/asset-api";
import FeaturedAsset from "~/modules/assets/components/FeaturedAsset.vue";
import {assetSearchOptionsToQuery, newSearchOptions} from "~/lib/assets/asset-helpers";
import AssetCard from "~/modules/assets/components/AssetCard.vue";
import AssetSearchRouter from "~/modules/assets/components/search/AssetSearchRouter.vue";

@Component({
	components: {
		FeaturedAsset,
		AssetSearch: AssetSearchRouter,
		AssetCard:AssetCard,
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
