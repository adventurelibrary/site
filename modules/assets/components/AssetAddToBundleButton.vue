<template>
	<button class="asset-action action-add-asset-to-bundle" @mousedown="stopPropagation" @click="openModal" type="button">
		<i class="ci-plus"></i>
	</button>
</template>
<script lang="ts">
import {Component, Prop, Getter, mixins} from "nuxt-property-decorator";
import {Asset} from "~/modules/assets/asset-types";
import StopPropagation from "~/mixins/StopPropagation.vue";

@Component
export default class AssetDownload extends mixins(StopPropagation) {
	@Prop() asset : Asset
	@Getter('isLoggedIn') isLoggedIn : boolean

	openModal () {
		// TODO: Remove && false when we want to actually check for a user
		if (!this.isLoggedIn) {
			this.$store.dispatch('openLoginModal')
			return
		}

		this.$store.dispatch('openAddToBundleModal', {
			assets: [this.asset]
		})
	}
}
</script>
