<template>
	<form @submit="submit">
		<FormErrors :error="form.error" />
		<BundleFields v-model="form.data" />
		<div v-if="asset">
			<div class="create-bundle-asset-item">
				<AssetThumbnail :asset="asset" />
				<div>
					<strong>{{asset.name}}</strong> by <strong>{{asset.creator_name}}</strong> will be added
				</div>
			</div>
		</div>
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
	@Prop() asset : Asset | null

	created () {
		this.form.data.public = true
	}

	mounted () {
		const input = this.$el.querySelector('input')
		if (input) {
			input.focus()
		}
	}

	async formAction () {
		const assetIds : string[] = []
		if (this.asset) {
			assetIds.push(this.asset.id)
		}
		await createBundle(this.form.data, assetIds)
		this.$emit('success')
	}
}
</script>
