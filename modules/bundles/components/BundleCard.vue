<template>
	<div class="bundle-card">
		<div>
			<BundleLink :bundle="bundle">{{bundle.name}}</BundleLink>
			<p>{{bundle.description}}</p>
		</div>
		<div>
			<button type="button" @click="clickDeleteBundle">Delete</button>
			<button type="button" @click="clickEditBundle">Edit</button>
		</div>
	</div>
</template>
<script lang="ts">
import {Component, Prop} from "nuxt-property-decorator";
import Vue from "vue";
import {Bundle} from "~/lib/bundles/bundle-types";
import {deleteBundle} from "~/lib/bundles/bundles-api";
import BundleLink from "~/modules/assets/components/BundleLink.vue";

@Component({
	components: {
		BundleLink: BundleLink
	}
})
class BundleCard extends Vue {
	@Prop() bundle : Bundle

	async clickDeleteBundle () {
		if (prompt('Type DELETE to delete bundle') !== 'DELETE') {
			return
		}

		await deleteBundle(this.bundle.id)
		this.$emit('deleted')
	}

	async clickEditBundle () {
		this.$store.dispatch('openEditBundleModal', {
			bundle: this.bundle
		})
	}
}
export default BundleCard
</script>
