<template>
  <NuxtLink :to="{name: 'creatorslug-assetslug', params: {creatorslug: asset.creator_slug, assetslug: asset.slug}}"><slot></slot></NuxtLink>
</template>
<script lang="ts">
import {Component, Prop} from "nuxt-property-decorator";
import Vue from "vue";
import {Asset} from "~/modules/assets/asset-types";

@Component
class AssetLink extends Vue {
  @Prop() asset : Asset
}
export default AssetLink
</script>
