<template>
  <NuxtLink :to="{name: 'asset-slug', params: {slug: slug}}"><slot></slot></NuxtLink>
</template>
<script lang="ts">
import {Component, Prop} from "nuxt-property-decorator";
import Vue from "vue";
import {Asset} from "~/lib/assets/asset-types";

@Component
class AssetLink extends Vue {
  @Prop() asset : Asset

	get slug () : string {
		let id = this.asset.id
		id = 'KjQB1Q8IWmpKvoGe9XXhtF8Ks9uagzqO'
		return this.asset.slug + '-' + id
	}
}
export default AssetLink
</script>
