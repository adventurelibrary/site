<template>
	<li class="card bundle-card">
		<BundleLink :bundle="bundle" :style="{backgroundImage: `url(${bundle.cover_thumbnail})`}">
			<span>{{bundle.name}}</span>
		</BundleLink>
	</li>
</template>
<script lang="ts">
import {Component, Prop} from "nuxt-property-decorator";
import Vue from "vue";
import {Bundle} from "~/modules/bundles/bundle-types";
import BundleLink from "~/modules/assets/components/BundleLink.vue";

@Component({
	components: {
		BundleLink: BundleLink
	}
})
class BundleCard extends Vue {
	@Prop() bundle : Bundle

}
export default BundleCard
</script>
