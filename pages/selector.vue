<template>
	<div class="page-wrapper header-page home-page">
		<section class="featured-assets search-page">
			<LoadingContainer :loading="$fetchState.pending" :error="$fetchState.error">
				<div asset-action-thingy>
					{{numSelected}} Assets Selected
					<button>Do Something With Them</button>
				</div>
				<ul class="search-results">
					<AssetCard v-for="asset in featured" :asset="asset" :key="asset.slug" />
				</ul>
			</LoadingContainer>
		</section>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Component} from "nuxt-property-decorator";
import {Asset} from "~/modules/assets/asset-types";
import {getFeaturedAssets} from "~/modules/assets/asset-api";
import FeaturedAsset from "~/modules/assets/components/FeaturedAsset.vue";
import AssetCard from "~/modules/assets/components/AssetCard.vue";

@Component({
	components: {
		FeaturedAsset,
		AssetCard:AssetCard,
	}
})
class HomePage extends Vue {
	public featured: Asset[] = []

	async fetch () {
		const assetsRes = await getFeaturedAssets()
		this.featured = assetsRes.assets
	}
}

export default HomePage
</script>
