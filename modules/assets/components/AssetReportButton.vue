<template>
	<button @click="openModal" type="button">
		Report Asset
	</button>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Prop, Getter} from "nuxt-property-decorator";
import {Asset} from "~/lib/assets/asset-types";

@Component
export default class AssetReportButton extends Vue {
	@Prop() asset : Asset

	openModal () {		
		this.$store.dispatch('openReportAssetModal', {
			asset: this.asset
		})

	}

}
</script>
