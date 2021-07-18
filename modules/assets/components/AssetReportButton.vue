<template>
	<a @click="openModal">
		Report Asset
	</a>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Prop} from "nuxt-property-decorator";
import {Asset} from "~/modules/assets/asset-types";

@Component
export default class AssetReportButton extends Vue {
	@Prop() asset : Asset

	openModal () {
		this.$store.dispatch('openAssetReportModal', {
			asset: this.asset
		})
	}
}
</script>
