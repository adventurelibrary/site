<template>
	<div class="modal-container" v-show="showingModal">
		<div class="modal-backdrop" @click="clickBackdrop">
		</div>
		<LoginModal v-if="showingLoginModal" :show="showingLoginModal" />
		<RegisterModal v-if="showingRegisterModal" :show="showingRegisterModal" />
		<AddAssetToBundle v-if="showingAddAssetToBundle" />
		<CreateBundleModal v-if="showingCreateBundle" />
		<EditAssetModal v-if="showingAssetEdit" />
		<EditBundleModal v-if="showingBundleEdit" />
		<BundleAddAssetsModal v-if="showBundleAddAssets" />
		<AssetArchiveModal v-if="showArchiveAsset" />
		<AssetReportModal v-if="showReportAsset" />
	</div>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Getter, State, Watch} from "nuxt-property-decorator";
import LoginModal from "~/modules/modals/LoginModal.vue";
import RegisterModal from "~/modules/modals/RegisterModal.vue";
import AddAssetToBundleModal from "~/modules/bundles/components/AddAssetsToBundleModal.vue";
import CreateBundleModal from "~/modules/bundles/components/CreateBundleModal.vue";
import EditBundleModal from "~/modules/bundles/components/EditBundleModal.vue";
import BundleAddAssetsModal from "~/modules/bundles/components/BundleAddAssetsModal.vue";
import AssetArchiveModal from "~/modules/modals/AssetArchiveModal.vue";
import AssetReportModal from "~/modules/modals/AssetReportModal.vue";
import EditAssetModal from "~/modules/assets/components/EditAssetModal.vue";

@Component({
	components: {
		EditAssetModal,
		BundleAddAssetsModal,
		EditBundleModal,
		AddAssetToBundle: AddAssetToBundleModal,
		LoginModal: LoginModal,
		RegisterModal: RegisterModal,
		CreateBundleModal: CreateBundleModal,
		AssetArchiveModal: AssetArchiveModal,
		AssetReportModal: AssetReportModal
	}
})
export default class Modals extends Vue {
	@Getter('showingModal') showingModal : boolean
	@State(state => state.modals.login)  showingLoginModal : boolean
	@State(state => state.modals.register)  showingRegisterModal : boolean
	@State(state => state.modals.addToBundle)  showingAddAssetToBundle : boolean
	@State(state => state.modals.createBundle)  showingCreateBundle : boolean
	@State(state => state.modals.editBundle)  showingBundleEdit : boolean
	@State(state => state.modals.editAsset)  showingAssetEdit : boolean
	@State(state => state.modals.bundleAddAssets)  showBundleAddAssets : boolean
	@State(state => state.modals.archiveAsset)  showArchiveAsset : boolean
	@State(state => state.modals.reportAsset)  showReportAsset : boolean

	@Watch('$route')
	routeWatcer () {
		// This is here so that if a user clicks a link that appears in the modal
		// that modal won't still be there when they navigate to that new page
		this.$store.dispatch('closeAllModals')
	}


	// TODO: Add an event listener for someone hitting the back button
	// We might want to close modals on back button
	mounted () {
		window.addEventListener('keydown', this.keyDown)
	}

	destroyed () {
		window.removeEventListener('keydown', this.keyDown)
	}

	keyDown (e: KeyboardEvent) {
		if (!this.showingModal) {
			return
		}

		if (e.key == 'Escape') {
			e.preventDefault()
			this.closeAllModals()
		}
	}

	clickBackdrop () {
		this.closeAllModals()
	}

	closeAllModals () {
		this.$store.dispatch('closeAllModals')
	}
}
</script>
