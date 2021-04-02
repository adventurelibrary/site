<template>
	<NuxtLink :to="{name: 'admin-assets-id', params: {id: id}}"><slot></slot></NuxtLink>
</template>
<script lang="ts">
import {Component, Prop} from "nuxt-property-decorator";
import Vue from "vue";
import {Asset} from "~/lib/assets/asset-types";

@Component
class AssetEditLink extends Vue {
	@Prop() asset : Asset

	get id () : string {
		return this.asset.id
	}
}
export default AssetEditLink
</script>
