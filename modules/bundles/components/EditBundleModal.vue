<template>
	<Modal
			:show="true"
			title="Edit Bundle"
			class-name="edit-bundle"
			@close="closeModal">
		<slot>
			<EditBundleForm :bundle="bundle" @success="onSuccess" />
		</slot>
	</Modal>
</template>
<script lang="ts">
import {Component, State} from "nuxt-property-decorator";
import Modal from "~/modules/modals/Modal.vue";
import Vue from "vue";
import EditBundleForm from "~/modules/bundles/components/EditBundleForm.vue";
import {Bundle} from "~/lib/bundles/bundle-types";

@Component({
	components: {
		EditBundleForm,
		Modal: Modal,
	}
})
export default class CreateBundleModal extends Vue {
	@State('editBundle') bundle : Bundle | null

	closeModal () {
		this.$store.dispatch('closeAllModals')
	}

	onSuccess () {
		this.notifySuccess('Bundle saved')
		this.$store.dispatch('closeAllModals')
	}
}
</script>
