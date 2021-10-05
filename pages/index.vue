<template>
	<div class="page-wrapper header-page home-page">
		<!--header class="page-header">
			<img src="https://cdn.discordapp.com/attachments/808965286915997726/833745227872337960/logo_wip_1line.svg">
			<h2>Featured Assets</h2>
		</header-->
		<section class="featured-assets search-page">
			<LoadingContainer :loading="$fetchState.pending" :error="$fetchState.error">
        <SelectAssetsContainer num-assets="featured.length">
					<AssetList :assets="featured" />
        </SelectAssetsContainer>
			</LoadingContainer>
		</section>
	</div>
</template>

<script lang="ts">
import {Component, mixins, State} from "nuxt-property-decorator";
import {Asset} from "~/modules/assets/asset-types";
import {getFeaturedAssets} from "~/modules/assets/asset-api";
import FeaturedAsset from "~/modules/assets/components/FeaturedAsset.vue";
import AssetList from "~/modules/assets/components/AssetList.vue";
import SelectAssetsContainer from "~/modules/assets/components/select/SelectAssetsContainer.vue";
import LoggedInFetchMixin from "~/mixins/LoggedInFetchMixin.vue";

@Component({
	components: {
    SelectAssetsContainer,
		FeaturedAsset,
		AssetList
	}
})
export default class HomePage extends mixins(LoggedInFetchMixin) {
	@State('assets', {
		namespace: 'assets'
	}) featured : Asset[]

	async fetch () {
		const assetsRes = await getFeaturedAssets()
		this.$store.dispatch('assets/setAssets', assetsRes.assets)
	}

	destroyed () {
		this.$store.dispatch('assets/clearAssets')
	}
}
</script>
