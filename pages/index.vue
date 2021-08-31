<template>
	<div class="page-wrapper header-page home-page">
		<!--header class="page-header">
			<img src="https://cdn.discordapp.com/attachments/808965286915997726/833745227872337960/logo_wip_1line.svg">
			<h2>Featured Assets</h2>
		</header-->
		<section class="featured-assets search-page">
			<LoadingContainer :loading="$fetchState.pending" :error="$fetchState.error">
        <SelectAssetsContainer num-assets="featured.length">
          <ul class="search-results">
            <AssetCard v-for="asset in featured" :asset="asset" :key="asset.slug" />
          </ul>
        </SelectAssetsContainer>
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
import SelectAssetsContainer from "~/modules/assets/components/select/SelectAssetsContainer.vue";

@Component({
	components: {
    SelectAssetsContainer,
		FeaturedAsset,
		AssetCard:AssetCard,
	}
})
class HomePage extends Vue {
	public featured: Asset[] = []

	async fetch () {
    this.$store.dispatch('clearSelectableAssets')
		const assetsRes = await getFeaturedAssets()
    this.$store.dispatch('setSelectableAssets', this.assetsRes.assets)
		this.featured = assetsRes.assets
	}
}

export default HomePage
</script>
