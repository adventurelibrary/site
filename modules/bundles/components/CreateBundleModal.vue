<template>
	<Modal
			:show="true"
			class-name="edit-bundle create-bundle"
			title="Create Bundle"
			@close="closeModal">
		<slot>
			<CreateBundleForm :assets="assets" @success="onSuccess" />
		</slot>
	</Modal>
</template>
<script lang="ts">
import {Component, State} from "nuxt-property-decorator";
import Modal from "~/modules/modals/Modal.vue";
import Vue from "vue";
import {Asset} from "~/modules/assets/asset-types";
import CreateBundleForm from "~/modules/bundles/components/CreateBundleForm.vue";

@Component({
	components: {
		Modal: Modal,
		CreateBundleForm: CreateBundleForm
	}
})
export default class CreateBundleModal extends Vue {
	@State('createBundleAssets') assets : Asset[]

	closeModal () {
		this.$store.dispatch('closeAllModals')
	}

	onSuccess () {
		this.notifySuccess('Bundle created')
		this.$store.dispatch('closeAllModals')
		this.$root.$emit('bundleCreated')
	}
}
</script>
