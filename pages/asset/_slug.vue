<template>
	<div class="container">

		<!-- maps -->
		<div v-if="asset.type == 'map'" class="container">
			-- fetch asset details from db via api
			<img :src="asset.thumbnailSrc">

			<div>
			{{asset.type}}
				<h1>{{asset.title}}</h1>
				By [user icon] {{assetAjax.data.creator.name}}
			</div>
			<div>
				<select name="assetFile" id="assetFile">
					<option value="-">Select Size</option>
					<option value="original">Small</option>
				</select>

				<button type="button">Unlock for {{asset.cost}}</button>
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

		<!-- tokens -->
		<div v-if="asset.type == 'token'" class="container">
			-- fetch asset details from db via api
			<img :src="asset.thumbnailSrc">

			<div>
			{{asset.type}}
				<h1>{{asset.title}}</h1>
				By [user icon] {{creator.name}}
			</div>
			<div>
				<select name="assetFile" id="assetFile">
					<option value="-">Select Size</option>
					<option value="original">Small</option>
				</select>

				<button type="button">Unlock for {{asset.cost}}</button>
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

		<!-- portraits -->
		<div v-if="asset.type == 'portrait'" class="container">
			-- fetch asset details from db via api
			<img :src="asset.thumbnailSrc">

			<div>
			{{asset.type}}
				<h1>{{asset.title}}</h1>
				By [user icon] {{creator.name}}
			</div>
			<div>
				<select name="assetFile" id="assetFile">
					<option value="-">Select Size</option>
					<option value="original">Small</option>
				</select>

				<button type="button">Unlock for {{asset.cost}}</button>
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

	</div>
</template>
<script lang="ts">
import { Context } from '@nuxt/types'
import Vue from 'vue'
import {Component} from "nuxt-property-decorator";

import {Asset, AssetResponse, Creator} from "~/lib/assets/asset-types";
import { getAssetAjax} from "~/lib/assets/asset-api";
import {Ajax, getAjaxData} from "~/lib/ajax";

@Component
class AssetPage extends Vue {
	public assetAjax : Ajax<AssetResponse>

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
		const res = getAjaxData<AssetResponse>(this.assetAjax)
		if (!res) {
			return null
		}
		return res.asset
	}


	get creator () : Creator | null {
		const res = getAjaxData<AssetResponse>(this.assetAjax)
		if (!res) {
			return null
		}
		return res.creator
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
