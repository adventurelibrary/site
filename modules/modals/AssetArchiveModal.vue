<template>
	<Modal
			:show="true"
			:title="`Delete ${asset.name} Asset`"
			class-name="archive-asset"
			@close="closeModal">
		<slot>
			<form class="archive-asset-form" @submit="archiveAsset">
				<AssetThumbnail :asset="asset" />
				<p>If no one has purchased this asset, it will be <strong>deleted entirely</strong></p>
				<p>If anyone has purchased this asset, it will be <strong>hidden from future searches</strong></p>
				<input type="text" v-model="confirmText" placeholder="Type DELETE to confirm"/>

				<button :disabled='deleteDisabled' type="submit" class="create">
					<span v-show="deleting">Deleting...</span>
					<span v-show="!deleting">Delete Asset</span>
				</button>
				<button @click="closeModal" type="button" class="create">Cancel</button>
			</form>
		</slot>
	</Modal>
</template>

<script lang="ts">
import {Component, State} from "nuxt-property-decorator";
import Modal from "~/modules/modals/Modal.vue";
import Vue from "vue";
import {Asset} from "~/modules/assets/asset-types";
import {archiveAsset} from "~/modules/assets/asset-api";
import AssetThumbnail from "~/modules/assets/components/AssetThumbnail.vue";

@Component({
	components: {
		Modal: Modal,
		AssetThumbnail: AssetThumbnail
	}
})
export default class AssetArchiveModal extends Vue {
	confirmText = ''
	deleting = false
	@State('archiveAsset') asset : Asset

	closeModal () {
		this.$store.dispatch('closeAllModals')
	}

	// handles archiving of the asset
	async archiveAsset (e: any) {
		e.preventDefault()
		if (this.deleteDisabled) {
			return
		}
		if (this.deleting) {
			return
		}
		this.deleting = true
		try {
			const result = await archiveAsset(this.asset.id)
			this.closeModal()

			if (result === 'delete') {
				this.notifySuccess(this.asset.name + " deleted")
			} else {
				this.notifySuccess(this.asset.name + " hidden")
			}
			this.$root.$emit('assetDeleted', this.asset.id)
		}
		catch (ex) {
			console.log('ex ', ex)
			this.notifyError(ex.toString())
		}
		this.deleting = false
	}

	get deleteDisabled () : boolean {
		const del = this.confirmText !== 'DELETE'
		return del
	}
}
</script>
