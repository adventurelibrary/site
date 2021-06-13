<template>
	<form @submit="submit">
		<FormErrors :error="form.error" />
		<BundleFields v-model="form.data" />
		<button type="submit">Save Bundle</button>
	</form>
</template>
<script lang="ts">
import {Component, mixins, Prop} from "nuxt-property-decorator";
import FormMixin from "~/mixins/Forms.vue";
import BundleFields from "~/modules/bundles/components/BundleFields.vue";
import {updateBundle} from "~/modules/bundles/bundles-api";
import {Bundle} from "~/modules/bundles/bundle-types";

@Component({
	components: {
		BundleFields: BundleFields
	}
})
export default class EditBundleForm extends mixins(FormMixin) {
	@Prop() bundle : Bundle | null

	created () {
		this.form.data = this.bundle
	}

	async formAction () {
		if (!this.bundle) {
			console.log('no bundle')
			return
		}
		await updateBundle(this.bundle.id, this.form.data)
		this.$emit('success')
	}
}
</script>
