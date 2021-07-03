<template>
	<ProfilePage active-tab="assets">
		<Fragment slot="actions">
			<nuxt-link v-if="isCreator" :to="{name: 'upload'}" class="button upgrade">Upload Assets</nuxt-link>
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
import {AssetsResponse} from "~/modules/assets/asset-types";
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
	assetsResponse : AssetsResponse

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

	async fetch () {
		const search = newSearchOptions()
		this.assetsResponse = await getMyAssets(search)
	}
}
</script>
