<template>
	<div class="bundle-page">

		<section class="bundle-info">
			<h1>{{bundle.name}}</h1>
			<div class="asset-description">
				{{bundle.description}}
				ID: {{bundle.id}}
			</div>
		</section>


		<section class="similar-assets">
			<!-- Similar assets -->
			<ul class="search-results">
				<!-- <li v-for="asset in relatedAssets.assets" :key="asset.id" :asset="asset">{{asset.name}}</li> -->
				<AssetCard v-for="asset in assets" :key="asset.id" :asset="asset"/>
			</ul>
		</section>
	</div>
</template>
<script lang="ts">
import { Context } from '@nuxt/types'
import Vue from 'vue'
import {Component} from "nuxt-property-decorator";

import {Asset} from "~/lib/assets/asset-types";
import { getAssetAjax, getAssetById} from "~/lib/assets/asset-api";
import {Ajax, getAjaxData} from "~/lib/ajax";
import AssetDownload from "~/modules/assets/components/AssetDownload.vue";
import TagList from "~/modules/tags/TagList.vue";

// related assets and search modules
import {AssetSearchOptions, AssetsResponse} from "~/lib/assets/asset-types";
import {newAssetsAjax, getRelatedAssetsByTags} from "~/lib/assets/asset-api";
import AssetCard from "~/modules/assets/components/AssetCard.vue";
import {newBundleAjax, newBundlesAjax} from "~/lib/bundles/bundles-api";
import {Bundle, BundleResponse} from "~/lib/bundles/bundle-types";

@Component({
	components: {
		AssetDownload: AssetDownload,
		TagList: TagList,
		AssetCard
	}
})
class BundlePage extends Vue {
	bundleAjax = newBundleAjax()


	assetsAjax : Ajax<AssetsResponse> = newAssetsAjax()
	skip = 0
	perPage = 5
	loadingMore = false
	scrollTimeout : NodeJS.Timeout

	// static asset fetch by id
	/*
		Example Asset IDs:
		rJsMIN5v9WrbxvvNkJ9r31aUQEIpHNbL
		fWPd13YkAAEJaxsFDptS7ZZcfmppOreN
		6L13wQqQbRfkVHkbPirNKQP0rQWTafRq
	*/
	//public Asset : Asset = getAssetById("rJsMIN5v9WrbxvvNkJ9r31aUQEIpHNbL");

	// setting header meta tags
	head () {
		const bundle = this.bundle
		if (bundle == null) {
			return {
				title: '404 Bundle',
				description: ''
			}
		}
		return {
			title: bundle.name + ' - Bundle',
			description: bundle.description,

			// meta tags nuxt implementation
			meta: [
				{
					hid: 'description',  // hid is used as unique identifier. Do not use `vmid` for it as it will not work
					name: bundle.name + ' - Bundle',
					description: bundle.description,
				},

				// Twitter specific:
				// https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup
				{ name: 'twitter:title', content: bundle.name + ' - Bundle' },
				{ name: 'twitter:description', content: bundle.description},

				// Facebook specific tags:
				// https://developers.facebook.com/docs/sharing/webmasters/
				{ name: 'og:title', content: bundle.name + ' - Bundle' },
				{ name: 'og:description', content: bundle.description},
			]
		}
	}


	get bundle () : Bundle | undefined {
		const data = getAjaxData<BundleResponse>(this.bundleAjax)
		if (!data) {
			return undefined
		}
		return data.bundle
	}

	get assets () : Asset[] {
		const data = getAjaxData<BundleResponse>(this.bundleAjax)
		if (!data) {
			return []
		}
		return data.assets
	}

	// fetching asset data and related assets array
	async asyncData (ctx: Context) {
		const bundleRes = await getAssetAjax(ctx.params.slug)
		return {
			bundleAjax: bundleRes,
		}
	}

}

export default BundlePage
</script>
