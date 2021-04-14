<template>
	<div class="modal-container" v-show="showingModal">
		<div class="modal-backdrop" @click="clickBackdrop">
		</div>
		<LoginModal v-if="showingLoginModal" :show="showingLoginModal" />
		<RegisterModal v-if="showingRegisterModal" :show="showingRegisterModal" />
		<AddAssetToBundle v-if="showingAddAssetToBundle" />
		<CreateBundleModal v-if="showingCreateBundle" />
	</div>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Getter, State} from "nuxt-property-decorator";
import LoginModal from "~/modules/modals/LoginModal.vue";
import RegisterModal from "~/modules/modals/RegisterModal.vue";
import AddAssetToBundleModal from "~/modules/bundles/components/AddAssetToBundleModal.vue";
import CreateBundleModal from "~/modules/bundles/components/CreateBundleModal.vue";

@Component({
	components: {
		AddAssetToBundle: AddAssetToBundleModal,
		LoginModal: LoginModal,
		RegisterModal: RegisterModal,
		CreateBundleModal: CreateBundleModal
	}
})
export default class Modals extends Vue {
	@Getter('showingModal') showingModal : boolean
	@State(state => state.modals.login)  showingLoginModal : boolean
	@State(state => state.modals.register)  showingRegisterModal : boolean
	@State(state => state.modals.addToBundle)  showingAddAssetToBundle : boolean
	@State(state => state.modals.createBundle)  showingCreateBundle : boolean

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
