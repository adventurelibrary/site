<template>
	<NuxtLink :to="{name: 'admin-assets-id', params: {id: asset.id}}"><slot></slot></NuxtLink>
</template>
<script lang="ts">
import {Component, Prop} from "nuxt-property-decorator";
import Vue from "vue";
import {Asset} from "~/lib/assets/asset-types";

@Component
class AssetEditLink extends Vue {
	@Prop() asset : Asset
}
export default AssetEditLink
</script>
