<template>
	<LoadingContainer :loading="$fetchState.pending" :error="$fetchState.error">
		<template v-if="creator.id">
			IF CREATOR
			<CreatorPage active-tab="assets" :creator="creator">
				<h1>{{creator.name}}'s Assets</h1>
				<LoadingContainer :loading="$fetchState.pending" :error="$fetchState.error">
					<ul class="assets">
						<AssetManageItem v-for="asset in assets" :key="asset.id" :asset="asset"></AssetManageItem>
					</ul>
				</LoadingContainer>
			</CreatorPage>
		</template>
	</LoadingContainer>
</template>
<script lang="ts">
import Vue from "vue";
import {Component, Getter, mixins} from "nuxt-property-decorator";
import {newSearchOptions} from "~/modules/assets/asset-helpers";
import {Asset} from "~/modules/assets/asset-types";
import AssetManageItem from "~/modules/assets/components/AssetManageItem.vue";
import {Fragment} from "vue-fragment";
import CreatorsManage from "~/mixins/CreatorsManage";
import {Creator, ManageCreatorAssets} from "~/modules/creators/creator-types";
import {getManageCreatorAssets, newCreator} from "~/modules/creators/creator-api";
import CreatorPage from "~/pages/creators/-components/CreatorPage.vue";

@Component({
	middleware: ['require_auth'],
	components: {
		CreatorPage,
		Fragment: Fragment,
		AssetManageItem: AssetManageItem
	}
})
export default class CreatorAssets extends mixins(CreatorsManage) {
	@Getter('isCreator') isCreator : boolean
	response : ManageCreatorAssets
	creator = newCreator()
	assets : Asset[] = []

	created () {
		// This event is emitted from the EditAssetModal when the form is successfully submitted
		// The data passed in is the data from the edit form
		this.$root.$on('assetUpdated', this.onAssetUpdated)
		this.$root.$on('assetDeleted', this.onAssetDeleted)
	}

	async fetch () {
		const search = newSearchOptions()
		const res = await getManageCreatorAssets(this.creatorId, search)
		console.log('res', res)
		this.response = res
		this.creator = res.creator
		this.assets = res.assets.assets
		console.log('this creator', this.creator)
	}

	onAssetUpdated (data: any) {
		if (!this.assets) {
			return
		}
		for (let i = 0; i < this.assets.length; i++) {
			const asset = this.assets[i]
			if (asset.id === data.id) {
				for (let k in data) {
					Vue.set(this.assets[i], k, data[k])
				}
				break
			}
		}
	}

	onAssetDeleted (assetId: string) {
		if (!this.response || !this.assets) {
			return
		}
		for (let i = 0; i < this.assets.length; i++) {
			const asset = this.assets[i]
			if (assetId === asset.id) {
				this.assets.splice(i, 1)
				break
			}
		}
	}
}
</script>
