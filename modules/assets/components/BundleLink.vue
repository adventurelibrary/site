<template>
  <NuxtLink :to="{name: 'bundle-id', params: {id: id}}"><slot></slot></NuxtLink>
</template>
<script lang="ts">
import {Component, Prop} from "nuxt-property-decorator";
import Vue from "vue";
import {Bundle} from "~/modules/bundles/bundle-types";

@Component
class BundleLink extends Vue {
  @Prop() bundle : Bundle

	get id () : string {
		return this.bundle.id
	}
}
export default BundleLink
</script>
