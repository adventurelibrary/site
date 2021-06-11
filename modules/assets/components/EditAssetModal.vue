<template>
	<Modal
			:show="true"
			title="Edit Asset"
			class-name="edit-asset"
			@close="closeModal">
		<slot>
			<EditAssetForm :asset="asset" @success="onSuccess" />
		</slot>
	</Modal>
</template>
<script lang="ts">
import {Component, State} from "nuxt-property-decorator";
import Modal from "~/modules/modals/Modal.vue";
import Vue from "vue";
import EditAssetForm from "~/modules/assets/components/EditAssetForm.vue";
import {Asset} from "~/lib/assets/asset-types";

@Component({
	components: {
		EditAssetForm,
		Modal: Modal,
	}
})
export default class EditAssetModal extends Vue {
	@State('editAsset') asset : Asset | null

	closeModal () {
		this.$store.dispatch('closeAllModals')
	}

	onSuccess () {
		this.notifySuccess('Asset saved')
		this.$store.dispatch('closeAllModals')
	}
}
</script>
