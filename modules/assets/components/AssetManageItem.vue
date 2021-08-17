<template>
	<AssetCard :key="asset.id" :asset="asset" hide-default-actions="true">
		<div class="extra-details" slot="extra-details">
			{{asset.visibility}}
		</div>
		<Fragment slot="extra-actions">
			<button type="button" @click="clickDeleteAsset" class="asset-action action-delete-asset" title="Delete Asset">
				<i class="ci-trash_full"></i>
			</button>
			<button type="button" @click="clickEditAsset" class="asset-action action-edit-asset" >
				<i class="ci-edit"></i>
			</button>
		</Fragment>
	</AssetCard>
</template>
<script lang="ts">
import {Component, Prop} from "nuxt-property-decorator";
import Vue from "vue";
import {Asset} from "~/modules/assets/asset-types";
import AssetLink from "~/modules/assets/components/AssetLink.vue";
import {Fragment} from "vue-fragment";
import AssetCard from "~/modules/assets/components/AssetCard.vue";

@Component({
	components: {
		AssetLink: AssetLink,
		AssetCard,
		Fragment
	}
})
class AssetManageItem  extends Vue {
	@Prop() asset : Asset

	clickDeleteAsset () {
		this.$store.dispatch('openAssetArchiveModal', {
			asset: this.asset
		})
	}

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
