<template>
	<div class="manage-asset">
		<div class="thumbnail" :style="`background-image: url(${asset.thumbnail});`">
			<!-- This Element Intentionally Left Empty -->
		</div>
		<div>
			<strong>{{asset.name}}</strong>
			<br />{{asset.visibility}}
		</div>
		<div class="actions">
			<button type="button" @click="clickEditAsset">Edit Asset</button>
		</div>
	</div>
</template>
<script lang="ts">
import {Component, Prop} from "nuxt-property-decorator";
import Vue from "vue";
import {Asset} from "~/lib/assets/asset-types";
import AssetLink from "~/modules/assets/components/AssetLink.vue";

@Component({
	components: {
		AssetLink: AssetLink
	}
})
class AssetManageItem  extends Vue {
	@Prop() asset : Asset

	clickEditAsset () {
		this.$store.dispatch('openEditAssetModal', {
			asset: this.asset
		})
	}
}
export default AssetManageItem
</script>
<style scoped>
.manage-asset {
	display: flex;
	width: 100%;
	flex-direction: row;
}
.thumbnail {
	width: 250px;
	height: 250px;
	background-size: cover;
}

.manage-asset .actions {
	margin-left: auto;
}
</style>
