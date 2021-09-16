<template>
	<Modal
			:show="true"
			:title="title"
			class-name="add-asset-to-bundle"
			@close="closeModal">
		<slot>
			<div>
				<button @click="createNewBundle" type="button" class="create">Create New Bundle</button>
			</div>
			<MyBundleSelector v-model="bundleIds" @loaded="onBundlesLoaded" />
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
import {addAssetsToBundles} from "~/modules/bundles/bundles-api";
import {BundlesResponse} from "~/modules/bundles/bundle-types";

@Component({
	components: {
		MyBundleSelector,
		Modal: Modal,
	}
})
export default class AddAssetToBundleModal extends Vue {
	bundleIds : string[] = []

	@State('addToBundleAssets') assets : Asset[]

	closeModal () {
		this.$store.dispatch('closeAllModals')
	}

	createNewBundle () {
		this.$store.dispatch('openCreateBundleWithAssets', {
			assets: this.assets
		})
	}

	// This happens when the user clicks the "Add To Bundles" button
	// They do this after they've searched and filtered through their list of bundles
	// and selected one or more bundles for the chosen asset to be added to
	async addToBundles () {
		try {
			const assetIds = this.assets.map(a => a.id)
			const num = assetIds.length
			await addAssetsToBundles(assetIds, this.bundleIds)
			this.notifySuccess(`Added ${num} asset${num === 1 ? '' : 's'} to ` + this.bundleIds.length + ' bundle' + (this.bundleIds.length == 1 ? '' : 's'))
			await this.$store.dispatch('closeAllModals')
		} catch (ex) {
			console.log('ex', ex)
			this.notifyError(ex.toString())
		}
	}

	// This event fires when the child component MyBundlesSelector has
	// finished making its ajax request to the server to get the user's
	// list of bundles
	// Here we can check to see if they have no bundles, in which case
	// we can automatically skip this selector modal and go to the
	// creation modal
	onBundlesLoaded (data: BundlesResponse) {
		if (data.total === 0) {
			this.createNewBundle()
		}
	}

	get title () : string {
		if (this.assets.length === 1) {
			return `Add ${this.assets[0].name} to Bundles`
		}
		return `Add ${this.assets.length} Assets to Bundles`
	}
}
</script>
