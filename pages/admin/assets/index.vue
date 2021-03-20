<template>
	<div>
		<table width="100%">
			<thead>
				<tr>
					<th>Title</th>
					<th>Type</th>
					<th>Tags</th>
				</tr>
			</thead>
			<tbody>
				<tr v-if="assets.length == 0">
					<td colspan="2">No assets</td>
				</tr>
				<tr v-for="asset in assets" :key="asset.id">
					<td>
						<AssetEditLink :asset="asset">{{asset.title}}</AssetEditLink>
					</td>
					<td>{{asset.type}}</td>
					<td>
						<TagList :tags="asset.tags" />
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
<script lang="ts">
import {Component} from "nuxt-property-decorator";
import {Context} from "@nuxt/types";
import {newAssetsAjax, searchAssets} from "~/lib/assets/asset-api";
import {doAjax} from "~/lib/ajax";
import {Asset, AssetsResponse} from "~/lib/assets/asset-types";
import {getRouteAssetSearchOptions} from "~/modules/assets/helpers";
import AdminPage from "~/admin/admin-page";
import TagList from "~/modules/tags/TagList.vue";
import AssetEditLink from "~/admin/components/AssetEditLink.vue";
@Component({
	components: {
		TagList,
		AssetEditLink
	}
})
export default class AssetsIndex extends AdminPage {
	public assetsAjax = newAssetsAjax()

	async asyncData (ctx: Context) {
		const search = getRouteAssetSearchOptions(ctx.route)
		const fn = async () => {
			return await searchAssets(search)
		}
		const assetsAjax = newAssetsAjax()
		await doAjax<AssetsResponse>(assetsAjax, fn)
		return {
			assetsAjax
		}
	}

	get assets () : Asset[] {
		if (this.assetsAjax.loading || this.assetsAjax.error || !this.assetsAjax.data) {
			return []
		}

		return this.assetsAjax.data.results
	}
}
</script>
