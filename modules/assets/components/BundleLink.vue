<template>
  <NuxtLink :to="{name: 'bundle-slug', params: {slug: slug}}"><slot></slot></NuxtLink>
</template>
<script lang="ts">
import {Component, Prop} from "nuxt-property-decorator";
import Vue from "vue";
import {Bundle} from "~/lib/bundles/bundle-types";

@Component
class BundleLink extends Vue {
  @Prop() bundle : Bundle

	get slug () : string {
		let id = this.bundle.id
		return this.bundle.slug + '-' + id
	}
}
export default BundleLink
</script>
