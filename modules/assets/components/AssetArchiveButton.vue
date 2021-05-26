<template>
	<button v-if="confirmCreatorOfAsset() == true" @click="openModal" type="button">
		Delete Asset
	</button>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Prop, Getter, State} from "nuxt-property-decorator";
import {Asset} from "~/lib/assets/asset-types";
import { state } from "~/store";

@Component
export default class AssetArchive extends Vue {
	@Prop() asset : Asset
	@Getter('isLoggedIn') isLoggedIn : boolean

	// confirm logged in user is creator of asset
	confirmCreatorOfAsset() {
/*
		const creatorId = this.asset.creator_id
		let userId = "admin-test"
		// get user id, check if logged in before trying
		if (this.isLoggedIn == true) {
			userId = this.$store.state.user.id;

			if (creatorId == userId) {
				return true
			}
			else {
				return false
			}
		}
*/

		//temp true return for testing and until login is back up
		return true
	}

	openModal () {
		// temp until login works again
		this.$store.dispatch('openArchiveAssetModal', {
			asset: this.asset
		})

	}

}
</script>
