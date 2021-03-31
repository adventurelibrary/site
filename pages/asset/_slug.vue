<template>
	<div class="container">

		<img :src="asset.thumbnailSrc">

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
			Similar assets
			[links : use code from front page within particular search terms]
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

@Component({
	components: {
		AssetDownload: AssetDownload
	}
})
class AssetPage extends Vue {
	public assetAjax : Ajax<Asset>

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
			description: asset.description
		}
	}

	get asset () : Asset | null {
		const res = getAjaxData<Asset>(this.assetAjax)
		if (!res) {
			return null
		}
		return res
	}

	async asyncData (ctx: Context) {
		const assetRes = await getAssetAjax(ctx.params.slug)
		return {
			assetAjax: assetRes
		}
	}
}

export default AssetPage
</script>
