<template>
	<form @submit="submit">
		<BundleFields v-model="form.data" />
		<div v-if="asset">
			Also add <strong>{{asset.name}}</strong> to bundle
		</div>
		<button type="submit">Create Bundle</button>
	</form>
</template>
<script lang="ts">
import {Component, mixins, Prop} from "nuxt-property-decorator";
import FormMixin from "~/mixins/Forms.vue";
import BundleFields from "~/modules/bundles/components/BundleFields.vue";
import {Asset} from "~/lib/assets/asset-types";
import {createBundle} from "~/lib/bundles/bundles-api";

@Component({
	components: {
		BundleFields: BundleFields
	}
})
export default class CreateBundleForm extends mixins(FormMixin) {
	@Prop() asset : Asset | null

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
