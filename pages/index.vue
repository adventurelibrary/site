<template>
	<div class="page-wrapper header-page home-page">
		<!--header class="page-header">
			<img src="https://cdn.discordapp.com/attachments/808965286915997726/833745227872337960/logo_wip_1line.svg">
			<h2>Featured Assets</h2>
		</header-->
		<section class="featured-assets search-page">
			<LoadingContainer :loading="$fetchState.pending" :error="$fetchState.error">
				<ul class="search-results">
					<AssetCard v-for="asset in featured" :asset="asset" :key="asset.slug" />
				</ul>
			</LoadingContainer>
		</section>
	</div>
</template>

<script lang="ts">
import {Component, mixins} from "nuxt-property-decorator";
import {Asset} from "~/modules/assets/asset-types";
import {getFeaturedAssets} from "~/modules/assets/asset-api";
import FeaturedAsset from "~/modules/assets/components/FeaturedAsset.vue";
import AssetCard from "~/modules/assets/components/AssetCard.vue";
import LoggedInFetchMixin from "~/mixins/LoggedInFetchMixin.vue";

@Component({
	components: {
		FeaturedAsset,
		AssetCard:AssetCard,
	}
})
class HomePage extends mixins(LoggedInFetchMixin) {
	public featured: Asset[] = []

	async fetch () {
		const assetsRes = await getFeaturedAssets()
		this.featured = assetsRes.assets
	}
}

export default HomePage
</script>
