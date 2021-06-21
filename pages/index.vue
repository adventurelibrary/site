<template>
	<div class="page-wrapper header-page home-page">
		<!--header class="page-header">
			<img src="https://cdn.discordapp.com/attachments/808965286915997726/833745227872337960/logo_wip_1line.svg">
			<h2>Featured Assets</h2>
		</header-->
		<LoadingContainer :loading="assetsAjax.loading" :error="assetsAjax.error">
			<section class="featured-assets search-page">
				<ul v-if="!assetsAjax.loading && !assetsAjax.error" class="search-results">
					<AssetCard v-for="asset in featured" :asset="asset" :key="asset.slug" />
				</ul>
			</section>
		</LoadingContainer>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Component} from "nuxt-property-decorator";
import {Asset, AssetsResponse} from "~/modules/assets/asset-types";
import {getFeaturedAssets, newAssetsAjax} from "~/modules/assets/asset-api";
import FeaturedAsset from "~/modules/assets/components/FeaturedAsset.vue";
import AssetCard from "~/modules/assets/components/AssetCard.vue";
import AssetSearchRouter from "~/modules/assets/components/search/AssetSearchRouter.vue";
import {Ajax, computeAjaxList, computeAjaxTotal, doAjax} from "~/lib/ajax";

@Component({
	components: {
		FeaturedAsset,
		AssetSearch: AssetSearchRouter,
		AssetCard:AssetCard,
	}
})
class HomePage extends Vue {
	assetsAjax : Ajax<AssetsResponse>

	async asyncData() {
		const assetsAjax = newAssetsAjax()
		// When we're in the browser, we return page data where it is
		// currently loading. For users coming from one page on our site
		// to this one without doing SSR, this will render the page as
		// loading when they first get to it
		if (process.client) {
			assetsAjax.loading = true
			return {
				assetsAjax
			}
		}

		// When in server side and doing SSR, we wait for the request
		// to be done before setting the page data. Our SSR pages
		// will then be fully rendered with content once the user lands on them
		await doAjax(assetsAjax, async() => {
			const assetsRes = await getFeaturedAssets()
			return assetsRes
		})
		return {
			assetsAjax
		}
	}

	mounted () {
		if (process.client && this.assetsAjax.loading) {
			doAjax(this.assetsAjax, async() => {
				return await getFeaturedAssets()
			})
		}
	}

	get numFeatured() : number {
		return computeAjaxTotal(this.assetsAjax)
	}

	get featured () : Asset[] {
		return computeAjaxList(this.assetsAjax, 'assets')
	}
}

export default HomePage
</script>
