<template>
	<article class="asset">

		<section class="asset-preview" :style="`background-image: url(${asset.thumbnail});`">
			<!-- Empty -->
		</section>

		<section class="asset-info">
			<h1 class="asset-title">{{asset.name}}</h1>
			<h3 class="asset-author">
				<!-- Will be a link to the author profile -->
				By<a href=""><i class="author-icon ci-user"></i>{{asset.creatorName}}</a>
			</h3>
			<div class="asset-description">
				{{asset.description}}
			</div>
			<TagList :tags="asset.tags" />
		</section>
		
		<section class="asset-downloads">
			<AssetDownload :asset="asset" />
			<span class="download-count">
				<span class="count">{{asset.downloads || 0}}</span>
				<span class="label">downloads</span>
			</span>
		</section>

		<section class="similar-assets">						
			<!-- Similar assets -->	
			<ul class="search-results">
				<!-- <li v-for="asset in relatedAssets.assets" :key="asset.id" :asset="asset">{{asset.name}}</li> -->
				<AssetCard v-for="asset in relatedAssets.assets" :key="asset.id" :asset="asset"/>
			</ul>
		</section>
	</article>
</template>
<script lang="ts">
import { Context } from '@nuxt/types'
import Vue from 'vue'
import {Component} from "nuxt-property-decorator";

import {Asset} from "~/lib/assets/asset-types";
import { getAssetAjax} from "~/lib/assets/asset-api";
import {Ajax, getAjaxData} from "~/lib/ajax";
import AssetDownload from "~/modules/assets/components/AssetDownload.vue";
import TagList from "~/modules/tags/TagList.vue";

// related assets and search modules
import {AssetSearchOptions, AssetsResponse} from "~/lib/assets/asset-types";
import {newAssetsAjax, getRelatedAssetsByTags} from "~/lib/assets/asset-api";
import AssetCard from "~/modules/assets/components/AssetCard.vue";


@Component({
	components: {
		AssetDownload: AssetDownload,
		TagList: TagList,
		AssetCard
	}
})
class BundlePage extends Vue {
	public assetAjax : Ajax<Asset>
	public relatedAssets : AssetsResponse

	// search setup
	public search : AssetSearchOptions
	// search.filters

	assetsAjax : Ajax<AssetsResponse> = newAssetsAjax()
	skip = 0
	perPage = 5
	loadingMore = false
	scrollTimeout : NodeJS.Timeout

	// setting header meta tags
	head () {
		const asset = this.asset
		if (asset == null) {
			return {
				title: '404 Asset',
				description: ''
			}
		}
		return {
			title: asset.name + ' - Asset',
			description: asset.description,
			og: asset.thumbnail,

			// meta tags nuxt implementation
			meta: [				
				{
					hid: 'description',  // hid is used as unique identifier. Do not use `vmid` for it as it will not work
					name: asset.name + ' - Asset',
					description: asset.description,
					og: asset.thumbnail
				},

				// Twitter specific:
				// https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup
				{ name: 'twitter:title', content: asset.name + ' - Asset' },
				{ name: 'twitter:description', content: asset.description},
				{ name: 'twitter:image', content: asset.thumbnail},
				{ name: 'twitter:card', content: asset.thumbnail},	

				// Facebook specific tags:
				// https://developers.facebook.com/docs/sharing/webmasters/
				{ name: 'og:title', content: asset.name + ' - Asset' },
				{ name: 'og:description', content: asset.description},
				{ name: 'og:image', content: asset.thumbnail},			

			]
		}
	}


	get asset () : Asset | null {
		const res = getAjaxData<Asset>(this.assetAjax)
		if (!res) {
			return null
		}
		return res
	}

	// fetching asset data and related assets array
	async asyncData (ctx: Context) {
		const assetRes = await getAssetAjax(ctx.params.slug)		
		let relatedAssets
		if (assetRes.data != undefined) {
			relatedAssets = await getRelatedAssetsByTags(assetRes.data)			
		}
		return {
			assetAjax: assetRes,
			relatedAssets: relatedAssets
		}
	}	

}

export default BundlePage
</script>
