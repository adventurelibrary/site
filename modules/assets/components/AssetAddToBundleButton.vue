<template>
	<button class="asset-action action-add-asset-to-bundle" @click="openModal" type="button">
		+
	</button>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Prop, Getter} from "nuxt-property-decorator";
import {Asset} from "~/modules/assets/asset-types";

@Component
export default class AssetDownload extends Vue {
	@Prop() asset : Asset
	@Getter('isLoggedIn') isLoggedIn : boolean

	openModal () {
		// TODO: Remove && false when we want to actually check for a user
		if (!this.isLoggedIn && false) {
			this.$store.dispatch('openLoginModal')
			return
		}

		this.$store.dispatch('openAddToBundleModal', {
			asset: this.asset
		})
	}
}
</script>
