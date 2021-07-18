<template>
	<Modal
			:show="true"
			:title="`Add ${asset.name} to Bundles`"
			class-name="add-asset-to-bundle"
			@close="closeModal">
		<slot>
			<h1>Add to Bundle</h1>
			<button @click="createNewBundle" type="button" class="create">Create New Bundle</button>
			<MyBundleSelector v-model="bundleIds" />
			<button @click="addToBundles" :disabled="bundleIds.length == 0" class="add">
				<span v-show="bundleIds.length">Add to {{bundleIds.length}} Bundle<S :num="bundleIds.length"></S></span>
				<span v-show="!bundleIds.length">Select Bundle(s)</span>
			</button>
		</slot>
	</Modal>
</template>
<script lang="ts">
import {Component, State} from "nuxt-property-decorator";
import Modal from "~/modules/modals/Modal.vue";
import Vue from "vue";
import {Asset} from "~/modules/assets/asset-types";
import MyBundleSelector from "~/modules/bundles/components/MyBundleSelector.vue";
import {addAssetToBundles} from "~/modules/bundles/bundles-api";

@Component({
	components: {
		MyBundleSelector,
		Modal: Modal,
	}
})
export default class AddAssetToBundleModal extends Vue {
	bundleIds : string[] = []

	@State('addToBundleAsset') asset : Asset

	closeModal () {
		this.$store.dispatch('closeAllModals')
	}

	createNewBundle () {
		this.$store.dispatch('openCreateBundleWithAsset', {
			asset: this.asset
		})
	}

	// This happens when the user clicks the "Add To Bundles" button
	// They do this after they've searched and filtered through their list of bundles
	// and selected one or more bundles for the chosen asset to be added to
	async addToBundles () {
		try {
			await addAssetToBundles(this.asset.id, this.bundleIds)
			this.notifySuccess('Added asset to ' + this.bundleIds.length + ' bundle' + (this.bundleIds.length == 1 ? '' : 's'))
			await this.$store.dispatch('closeAllModals')
		} catch (ex) {
			console.log('ex', ex)
			this.notifyError(ex.toString())
		}
	}
}
</script>
