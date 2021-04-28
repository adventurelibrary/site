<template>
  <NuxtLink :to="{name: 'bundle-slug', params: {slug: slug}}"><slot></slot></NuxtLink>
</template>
<script lang="ts">
import {Component, Prop} from "nuxt-property-decorator";
import Vue from "vue";
import {BundleResponse} from "~/lib/bundles/bundle-types";

@Component
class BundleLink extends Vue {
  @Prop() bundleResponse : BundleResponse

	get slug () : string {
		let id = this.bundleResponse.bundle.id
		return this.bundleResponse.bundle.slug + '-' + id		
	}
}
export default BundleLink
</script>
