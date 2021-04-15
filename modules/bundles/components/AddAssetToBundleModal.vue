<template>
	<Modal
			:show="true"
			:title="`Add ${asset.name} to Bundles`"
			@close="closeModal">
		<slot>
			<button @click="createNewBundle" type="button">Create New Bundle</button>
			<div>
				<MyBundleSelector v-model="bundleIds" />
				<button @click="addToBundles" :disable="bundleIds.length == 0">
					<span>Add to {{bundleIds.length}} Bundle<S :num="bundleIds.length"></S></span>
				</button>
			</div>
		</slot>
	</Modal>
</template>
<script lang="ts">
import {Component, State} from "nuxt-property-decorator";
import Modal from "~/modules/modals/Modal.vue";
import Vue from "vue";
import {Asset} from "~/lib/assets/asset-types";
import MyBundleSelector from "~/modules/bundles/components/MyBundleSelector.vue";

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
		console.log('close em all')
		this.$store.dispatch('closeAllModals')
	}

	createNewBundle () {
		this.$store.dispatch('openCreateBundleWithAsset', {
			asset: this.asset
		})
	}

	addToBundles () {
		alert('Adding ' + this.asset.name + ' to ' + this.bundleIds.length + 'bundle(s)')
	}
}
</script>
