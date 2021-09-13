<template>
	<form @submit="submit">
		<FormErrors :error="form.error" />
		<BundleFields v-model="form.data" />
		<div v-for="asset in visibleAssets" :key="asset.id">
			<div class="create-bundle-asset-item">
				<AssetThumbnail :asset="asset" />
				<div>
					<strong>{{asset.name}}</strong> by <strong>{{asset.creator_name}}</strong> will be added
				</div>
			</div>
		</div>
		<div v-if="andMore">And {{andMore}} more will be added</div>
		<SubmitButton idle-text="Create Bundle" :submitting="form.submitting"></SubmitButton>
	</form>
</template>
<script lang="ts">
import {Component, mixins, Prop} from "nuxt-property-decorator";
import FormMixin from "~/mixins/Forms.vue";
import BundleFields from "~/modules/bundles/components/BundleFields.vue";
import {Asset} from "~/modules/assets/asset-types";
import {createBundle} from "~/modules/bundles/bundles-api";
import SubmitButton from "~/components/forms/SubmitButton.vue";
import AssetThumbnail from "~/modules/assets/components/AssetThumbnail.vue";

@Component({
	components: {
		AssetThumbnail,
		SubmitButton,
		BundleFields: BundleFields
	}
})
export default class CreateBundleForm extends mixins(FormMixin) {
  numAssetsLimit = 4
  numAssetsCutoff = 2

	@Prop() assets : Asset[]

	created () {
		this.form.data.public = true
	}

	async formAction () {
		const assetIds : string[] = this.assets.map(x => x.id)
		await createBundle(this.form.data, assetIds)
		this.$emit('success')
	}

  get andMore () : number {
    if (this.assets.length > this.numAssetsLimit) {
      return this.assets.length - this.numAssetsCutoff
    }

    return 0
  }

	get visibleAssets () : Asset[] {
    if (this.assets.length > this.numAssetsLimit) {
			return this.assets.slice(0, this.assets.length - this.numAssetsCutoff)
    }
    return this.assets
  }
}
</script>
