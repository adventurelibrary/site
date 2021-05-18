<template>
	<div class="page-wrapper header-page home-page">
		<!--header class="page-header">
			<img src="https://cdn.discordapp.com/attachments/808965286915997726/833745227872337960/logo_wip_1line.svg">
			<h2>Featured Assets</h2>
		</header-->		
		<section class="featured-assets search-page">
			<ul class="search-results">
				<AssetCard v-for="asset in featured" :asset="asset" :key="asset.slug" />
			</ul>
		</section>
	</div>
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
			featured: assetsRes.assets
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
