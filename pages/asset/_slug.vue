<template>
	<div class="container">

		<img :src="asset.thumbnail" width="100%">

		<div>
			<h1>{{asset.name}}</h1>
			By [user icon] {{asset.creatorName}}
		</div>
		<div>
			<AssetDownload :asset="asset" />
		</div>
		<div>
			{{asset.downloads}}
		</div>

		<div>
			{{asset.description}}
		</div>

		<div>
			<TagList :tags="asset.tags" />
		</div>

		<div>						
			<!-- Similar assets -->	
			<ul class="search-results">
				<!-- <li v-for="asset in relatedAssets.assets" :key="asset.id" :asset="asset">{{asset.name}}</li> -->
				<AssetCard v-for="asset in relatedAssets.assets" :key="asset.id" :asset="asset"/>
			</ul>
		</div>
	</div>
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
class AssetPage extends Vue {
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
				{ name: 'twitter:title', content: asset.name + ' - Asset' },
				{ name: 'twitter:description', content: asset.description},
				{ name: 'twitter:image', content: asset.thumbnail},
				{ name: 'twitter:card', content: asset.thumbnail}	
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

export default AssetPage
</script>
