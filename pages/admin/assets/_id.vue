<template>
	<div class="card">
		<div class="card-header">
			Edit Asset
		</div>
		<div class="card-body">
			<LoadingContainer :loading="assetAjax.loading" :error="assetAjax.error">
				<form @submit="submit">
					<FormErrors :error="form.error" />
					<AssetFields v-model="data" />
					<div>
						<button type="button" style="float: right;" @click="deleteAsset">Delete</button>
						<button type="submit">Submit</button>
					</div>
				</form>
			</LoadingContainer>
		</div>
	</div>
</template>
<script lang="ts">
import {Component, mixins} from "nuxt-property-decorator";
import {Context} from "@nuxt/types";
import AdminPage from "~/admin/admin-page";
import {Asset, AssetFormData} from "~/modules/assets/asset-types";
import {
	assetFormDataToPayload,
	assetToFormData,
	getAssetAjaxById,
	newAssetAjax,
	saveAsset
} from "~/modules/assets/asset-api";
import LoadingContainer from "~/components/LoadingContainer.vue";
import AssetFields from "~/modules/assets/components/AssetFields.vue";
import FormMixin from "~/mixins/Forms.vue";


@Component({
	components: {
		LoadingContainer: LoadingContainer,
		AssetFields: AssetFields
	}
})
export default class EditAssetPage extends mixins(AdminPage, FormMixin) {
	public assetAjax = newAssetAjax()
	public data : AssetFormData
	public id : string

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
		if (this.assetAjax.loading || this.assetAjax.error || !this.assetAjax.data) {
			return null
		}

		return this.assetAjax.data
	}

	validateForm(): string {
    if (!this.data.name || this.data.name === '') {
      return 'Title is required'
    }
    return ''
  }

  async formAction () {
		await saveAsset(this.id, this.data)
	}

	async asyncData (ctx: Context) {
		const assetRes = await getAssetAjaxById(ctx.params.id)
		let data = {}
		if (assetRes.data) {
			data = assetToFormData(assetRes.data)
		}
		return {
			assetAjax: assetRes,
			data: data,
			id: ctx.params.id
		}
	}

	deleteAsset () {
		if (prompt('Type DELETE to delete asset') !== 'DELETE') {
			return
		}

		this.notifySuccess('Asset deleted (but not really yet)')
	}
}
</script>
