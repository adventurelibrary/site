<template>
  <NuxtLink :to="{name: 'asset-slug', params: {slug: asset.slug}}"><slot></slot></NuxtLink>
</template>
<script lang="ts">
import {Component, Prop} from "nuxt-property-decorator";
import Vue from "vue";
import {Asset} from "~/lib/assets/asset-types";

@Component
class AssetLink extends Vue {
  @Prop() asset : Asset
}
export default AssetLink
</script>
