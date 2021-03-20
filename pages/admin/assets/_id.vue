<template>
	<LoadingContainer :loading="assetAjax.loading" :error="assetAjax.error">
		Edit this asset
		<form @submit="saveAsset">
			<AssetFields :asset="data" />
			<div>
				<button>Submit</button>
			</div>
		</form>
	</LoadingContainer>
</template>
<script lang="ts">
import {Component} from "nuxt-property-decorator";
import {Context} from "@nuxt/types";
import AdminPage from "~/admin/admin-page";
import {Asset, AssetFormData} from "~/lib/assets/asset-types";
import {assetFormDataToPayload, assetResponseToFormData, getAssetAjaxById, newAssetAjax} from "~/lib/assets/asset-api";
import LoadingContainer from "~/components/LoadingContainer.vue";
import AssetFields from "~/modules/assets/components/AssetFields.vue";

@Component({
	components: {
		LoadingContainer: LoadingContainer,
		AssetFields: AssetFields
	}
})
export default class EditAssetPage extends AdminPage {
	public assetAjax = newAssetAjax()
	public data : AssetFormData

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

		return this.assetAjax.data.asset
	}

	async saveAsset (e: any) {
		e.preventDefault()
		console.log('save this')
		const data = assetFormDataToPayload(this.data)
		console.log('data', data)
	}

	async asyncData (ctx: Context) {
		const assetRes = await getAssetAjaxById(ctx.params.id)
		let data = {}
		if (assetRes.data) {
			data = assetResponseToFormData(assetRes.data)
		}
		return {
			assetAjax: assetRes,
			data: data
		}
	}
}
</script>
