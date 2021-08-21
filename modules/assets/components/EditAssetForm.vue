<template>
	<form @submit="submit" class="edit-asset">
		<FormErrors :error="form.error" />
		<AssetFields v-model="form.data" />
		<button type="submit">Save Asset</button>
	</form>
</template>
<script lang="ts">
import {Component, mixins, Prop} from "nuxt-property-decorator";
import FormMixin from "~/mixins/Forms.vue";
import AssetFields from "~/modules/assets/components/AssetFields.vue";
import {saveAsset} from "~/modules/assets/asset-api";
import {Asset} from "~/modules/assets/asset-types";

@Component({
	components: {
		AssetFields: AssetFields
	}
})
export default class EditAssetForm extends mixins(FormMixin) {
	@Prop() asset : Asset | null

	created () {
		this.form.data = {
			...this.asset
		}
	}

	async formAction () {
		if (!this.asset) {
			return
		}
		await saveAsset(this.asset.id, this.form.data)
		this.$emit('success', this.form.data)
	}
}
</script>
