<template>
	<CCard>
		<CCardHeader>
			Edit Asset
		</CCardHeader>
		<CCardBody>
			<LoadingContainer :loading="assetAjax.loading" :error="assetAjax.error">
				<form @submit="submit">
					<FormErrors :error="form.error" />
					<AssetFields :asset="data" @assetChanged="dataChanged" />
					<div>
						<CButton type="button" color="danger" style="float: right;" @click="deleteAsset">Delete</CButton>
						<CButton type="submit" color="primary">Submit</CButton>
					</div>
				</form>
			</LoadingContainer>
		</CCardBody>
	</CCard>
</template>
<script lang="ts">
import {Component, mixins} from "nuxt-property-decorator";
import {Context} from "@nuxt/types";
import AdminPage from "~/admin/admin-page";
import {Asset, AssetFormData} from "~/lib/assets/asset-types";
import {assetFormDataToPayload, assetToFormData, getAssetAjaxById, newAssetAjax} from "~/lib/assets/asset-api";
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
		const data = assetFormDataToPayload(this.data)
		console.log('do some saving of this data', data)
	}

	async asyncData (ctx: Context) {
		const assetRes = await getAssetAjaxById(ctx.params.id)
		let data = {}
		if (assetRes.data) {
			data = assetToFormData(assetRes.data)
		}
		return {
			assetAjax: assetRes,
			data: data
		}
	}

	deleteAsset () {
		if (prompt('Type DELETE to delete asset') !== 'DELETE') {
			return
		}

		this.notifySuccess('Asset deleted (but not really yet)')
	}

	dataChanged (data: any) {
		this.data = data
	}
}
</script>
