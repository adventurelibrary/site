<template>
	<div class="bundle-card">
		<div>
			<BundleLink :bundle="bundle">{{bundle.name}}</BundleLink>
			<p>{{bundle.description}}</p>
		</div>
	</div>
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
