<template>
	<div class="container">
		<AssetDetails :asset="asset" />
	</div>
</template>
<script lang="ts">
import { Context } from '@nuxt/types'
import Vue from 'vue'
import {Component} from "nuxt-property-decorator";

import {Asset} from "~/lib/assets/asset-types";
import { getAssetAjax} from "~/lib/assets/asset-api";
import {Ajax} from "~/lib/ajax";

@Component
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
			title: asset.title + ' - Asset',
			description: asset.description
		}
	}

	get asset () : Asset | null {
		if (this.assetAjax.loading || this.assetAjax.error || !this.assetAjax.data) {
			return null
		}

		return this.assetAjax.data
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
