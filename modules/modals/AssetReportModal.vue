<template>
	<Modal
		:show="true"
		:title="`Report ${asset.name} Asset`"
		class-name="report-asset"
		@close="closeModal">
		<slot>
			<div>
				<h1>Report</h1>
				<form v-on:submit="sendReport()" class="report-form">
					<FormGroup label="Report category">
						<select v-model='reportCategory'>
							<option v-for="option in options" v-bind:key="option.value">
								some text
								{{ option.text }}
							</option>
						</select>
					</FormGroup>

						<!-- only display name and contact email if user is not logged in, otherwise use logged in details -->
					<FormGroup label="Name">
						<input v-model="name" placeholder="Your name." />
					</FormGroup>

					<FormGroup label="Name">
						<input v-model="email" placeholder="Your email address." />
					</FormGroup>

					<FormGroup label="Name" class="text-area">
						<textarea v-model="message" placeholder="Leave your message here."></textarea>
					</FormGroup>
					<button>Send Report</button>
				</form>
			</div>
		</slot>
	</Modal>
</template>

<script lang="ts">
import {Component, Getter, State} from "nuxt-property-decorator";
import {User} from "~/lib/users/user-types"
import {Asset} from "~/lib/assets/asset-types";
import Vue from "vue";
import Modal from "~/modules/modals/Modal.vue";
import FormGroup from "~/components/forms/FormGroup.vue";
import {reportAsset} from "~/lib/assets/asset-api";

@Component({
	components: {
		Modal: Modal,
		FormGroup: FormGroup
	}
})
export default class ReportAssetModal extends Vue {
	@State('user') user : User
	@Getter('isLoggedIn') isLoggedIn : boolean
	@State('reportAsset') asset : Asset

	name = ''
	options = [
		{text: 'Inappropriate content', value: 'Inappropriate content'},
		{text: 'Low quality', value: 'Low quality'},
		{text: 'Misleading product description', value: 'Misleading product description'},
		{text: 'Stolen content', value: 'Stolen content'},
		{text: 'Not as advertised', value: 'Not as advertised'},
		{text: 'Other', value: 'Other'}
	]
	reportCategory = ''
	message= ''
	email = ''

	closeModal () {
		this.$store.dispatch('closeAllModals')
	}

	// handles archiving of the asset
	async sendReport () {
		try {
			await reportAsset(this.asset.id, this.asset.name, this.reportCategory, this.name, this.email, this.message)
			this.closeModal()

			// send message for user
			//this.$store.dispatch('notifySuccess', "Asset deleted successfully.")
			this.notifySuccess("Asset " + this.asset.name + " was reported successfully.")
		}
		catch (ex) {
			console.log('ex ', ex)
			this.notifyError(ex.toString())
		}
	}
}
</script>
