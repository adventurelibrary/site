<template>
	<Modal
			:show="true"
			class-name="create-bundle-modal"
			title="Create Bundle"
			@close="closeModal">
		<slot>
			Asset: {{asset.name}}
			<CreateBundleForm :asset="asset" @success="onSuccess" />
		</slot>
	</Modal>
</template>
<script lang="ts">
import {Component, State} from "nuxt-property-decorator";
import Modal from "~/modules/modals/Modal.vue";
import Vue from "vue";
import {Asset} from "~/lib/assets/asset-types";
import CreateBundleForm from "~/modules/bundles/components/CreateBundleForm.vue";

@Component({
	components: {
		Modal: Modal,
		CreateBundleForm: CreateBundleForm
	}
})
export default class CreateBundleModal extends Vue {
	@State('createBundleAsset') asset : Asset | null

	closeModal () {
		console.log('close em')
		this.$store.dispatch('closeAllModals')
	}

	onSuccess () {
		this.notifySuccess('Bundle created')
		this.$store.dispatch('closeAllModals')
	}
}
</script>
