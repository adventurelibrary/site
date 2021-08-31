<template>
  <NuxtLink v-on:click.native="linkOnClick" :to="{name: 'asset-slug', params: {slug: slug}}"><slot></slot></NuxtLink>
</template>
<script lang="ts">
import {Component, Prop} from "nuxt-property-decorator";
import Vue from "vue";
import {Asset} from "~/modules/assets/asset-types";

@Component
class AssetLink extends Vue {
  @Prop() asset : Asset
  @Prop({
    default: null
  }) onClick : Function | null

  linkOnClick (e: any) {
    this.$emit('linkClick', e)
  }

	get slug () : string {
		let id = this.asset.id
		return this.asset.slug + '-' + id
	}
}
export default AssetLink
</script>
