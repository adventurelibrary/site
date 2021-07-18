<template>
	<ProfilePage active-tab="assets">
		<Fragment slot="actions">
			<template v-if="isCreator">
				<nuxt-link v-if="isCreator" :to="{name: 'upload'}" key="is-creator" class="button upgrade">Upload Assets</nuxt-link>
			</template>
		</Fragment>
		<h1>My Assets</h1>
		<LoadingContainer :loading="$fetchState.pending" :error="$fetchState.error">
			<ul class="assets">
				<AssetManageItem v-for="asset in assets" :key="asset.id" :asset="asset"></AssetManageItem>
			</ul>
		</LoadingContainer>
	</ProfilePage>
</template>
<script lang="ts">
import Vue from "vue";
import {Component, Getter} from "nuxt-property-decorator";
import ProfilePage from "@/pages/user/components/ProfilePage.vue";
import {newSearchOptions} from "~/modules/assets/asset-helpers";
import {Asset, AssetsResponse} from "~/modules/assets/asset-types";
import AssetManageItem from "~/modules/assets/components/AssetManageItem.vue";
import {Fragment} from "vue-fragment";
import {getMyAssets} from "~/modules/assets/asset-api";

@Component({
	middleware: ['require_auth'],
	components: {
		ProfilePage,
		Fragment: Fragment,
		AssetManageItem: AssetManageItem
	}
})
export default class UserAssets extends Vue {
	@Getter('isCreator') isCreator : boolean
	assetsResponse : AssetsResponse = {
		assets: [],
		total: 0
	}

	created () {
		// This event is emitted from the EditAssetModal when the form is successfully submitted
		// The data passed in is the data from the edit form
		this.$root.$on('assetUpdated', (data: any) => {
			if (!this.assetsResponse || !this.assetsResponse.assets) {
				return
			}
			for (let i = 0; i < this.assetsResponse.assets.length; i++) {
				const asset = this.assetsResponse.assets[i]
				if (asset.id === data.id) {
					for (let k in data) {
						Vue.set(this.assetsResponse.assets[i], k, data[k])
					}
					break
				}
			}
		})
	}

	get assets() : Asset[] {
		if (!this.assetsResponse) {
			return []
		}
		return this.assetsResponse.assets || []
	}

	async fetch () {
		const search = newSearchOptions()
		const myAssets = await getMyAssets(search)
		this.assetsResponse = myAssets
	}
}
</script>
