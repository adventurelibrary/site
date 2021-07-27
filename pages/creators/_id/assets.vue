<template>
	<LoadingContainer :loading="$fetchState.pending" :error="$fetchState.error">
		<ProfilePage active-tab="assets">
			<Fragment slot="actions">
				<nuxt-link :to="{name: 'upload'}" key="is-creator" class="button">Upload Assets</nuxt-link>
			</Fragment>
			<h1>{{creator.name}}'s Assets</h1>
			<LoadingContainer :loading="$fetchState.pending" :error="$fetchState.error">
				<ul class="assets">
					<AssetManageItem v-for="asset in assets" :key="asset.id" :asset="asset"></AssetManageItem>
				</ul>
			</LoadingContainer>
		</ProfilePage>
	</LoadingContainer>
</template>
<script lang="ts">
import Vue from "vue";
import {Component, Getter, mixins} from "nuxt-property-decorator";
import ProfilePage from "@/pages/user/-components/ProfilePage.vue";
import {newSearchOptions} from "~/modules/assets/asset-helpers";
import {Asset} from "~/modules/assets/asset-types";
import AssetManageItem from "~/modules/assets/components/AssetManageItem.vue";
import {Fragment} from "vue-fragment";
import CreatorsManage from "~/mixins/CreatorsManage";
import {Creator, ManageCreatorAssets} from "~/modules/creators/creator-types";
import {getManageCreatorAssets} from "~/modules/creators/creator-api";


@Component({
	middleware: ['require_auth'],
	components: {
		ProfilePage,
		Fragment: Fragment,
		AssetManageItem: AssetManageItem
	}
})
export default class CreatorAssets extends mixins(CreatorsManage) {
	@Getter('isCreator') isCreator : boolean
	response : ManageCreatorAssets

	created () {
		// This event is emitted from the EditAssetModal when the form is successfully submitted
		// The data passed in is the data from the edit form
		this.$root.$on('assetUpdated', this.onAssetUpdated)
		this.$root.$on('assetDeleted', this.onAssetDeleted)
	}

	get assets() : Asset[] {
		if (!this.response || !this.response.assets) {
			return []
		}
		return this.response.assets.assets || []
	}

	get creator () : Creator | undefined {
		if (!this.response || !this.response.creator) {
			return undefined
		}

		return this.response.creator
	}

	async fetch () {
		const search = newSearchOptions()
		const res = await getManageCreatorAssets(this.creatorId, search)
		this.response = res
	}

	onAssetUpdated (data: any) {
		if (!this.response || !this.response.assets) {
			return
		}
		for (let i = 0; i < this.response.assets.assets.length; i++) {
			const asset = this.response.assets.assets[i]
			if (asset.id === data.id) {
				for (let k in data) {
					Vue.set(this.response.assets.assets[i], k, data[k])
				}
				break
			}
		}
	}

	onAssetDeleted (assetId: string) {
		if (!this.response || !this.response.assets.assets) {
			return
		}
		for (let i = 0; i < this.response.assets.assets.length; i++) {
			const asset = this.response.assets.assets[i]
			if (assetId === asset.id) {
				this.response.assets.assets.splice(i, 1)
				break
			}
		}
	}
}
</script>
