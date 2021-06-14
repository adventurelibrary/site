<template>	
	<Modal
			:show="true"
			:title="`Delete ${asset.name} Asset`"
			class-name="archive-asset"
			@close="closeModal">
		<slot>
			<form class="archive-asset-form">
				<h3>Are you sure you want to delete the "{{asset.name}}" Asset?</h3>
				
				<input id="confirmArchiveText" type="text" v-on:input="trackEntry()" placeholder="Type in DELETE to enable the Delete button."/>
				<span>Type in DELETE to enable the Delete button.</span>
				
				<button id="archiveButton" @click="archiveAsset" type="button" class="create" disabled>Delete Asset</button>
				<button @click="closeModal" type="button" class="create">Cancel</button>
			</form>
		</slot>
	</Modal>
</template>

<script lang="ts">

import {Component, State} from "nuxt-property-decorator";
import Modal from "~/modules/modals/Modal.vue";
import Vue from "vue";
import {Asset} from "~/lib/assets/asset-types";
import {archiveAsset} from "~/lib/assets/asset-api";

@Component({
	components: {
		Modal: Modal,
	}
})
export default class AssetArchiveModal extends Vue {

	@State('archiveAsset') asset : Asset

	closeModal () {		
		this.$store.dispatch('closeAllModals')
	}


	// tracks text typed in the 'confirmArchiveText' input field
	// if DELETE is typed, the archive button is enabled, otherwise its disabled
	trackEntry() {
		const inputField = (document.getElementById("confirmArchiveText") as HTMLInputElement)
		const archiveButton = (document.getElementById("archiveButton") as HTMLButtonElement)					

		// toggle archive button enabled status
		if (inputField.value == "DELETE") {				
			
			archiveButton.disabled = false
			console.log("DELETE typed, button enabled")
		}
		else {
			archiveButton.disabled = true
			console.log("DELETE not typed, button disabled")
		}
	}

	// handles archiving of the asset
	async archiveAsset () {
		try {
			await archiveAsset(this.asset.id)
			this.closeModal()

			// send message for user
			//this.$store.dispatch('notifySuccess', "Asset deleted successfully.")	
			this.notifySuccess("Asset " + this.asset.name + " deleted successfully.")			
		}
		catch (ex) {
			console.log('ex ', ex)
			this.notifyError(ex.toString())
		}
	}

}
</script>
