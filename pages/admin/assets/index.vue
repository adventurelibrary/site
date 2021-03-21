<template>
	<div>
		<CDataTable :items="assets" :fields="['title', 'type', 'tags']">
			<template #title="{item}">
				<td>
					<AssetEditLink :asset="item">{{item.title}}</AssetEditLink>
				</td>
			</template>
			<template #tags="item">
				<td>
					<TagList :tags="item.tags" />
				</td>
			</template>
		</CDataTable>
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

	// This is just some testing and demonstration, it will be removed later
	mounted () {
		this.notifySuccess('Successfully showed this message')
		setTimeout(() => {
			this.notifyError('Now an error')
		}, 1500)
	}

	get assets () : Asset[] {
		if (this.assetsAjax.loading || this.assetsAjax.error || !this.assetsAjax.data) {
			return []
		}

		return this.assetsAjax.data.results
	}
}
</script>
