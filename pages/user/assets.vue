<template>
	<ProfilePage active-tab="assets">
		<h1>My Unlocked Assets</h1>
		<LoadingContainer :loading="$fetchState.pending" :error="$fetchState.error">
			<ul class="assets">
				<AssetCard v-for="asset in assets" :key="asset.id" :asset="asset"></AssetCard>
			</ul>
		</LoadingContainer>
	</ProfilePage>
</template>
<script lang="ts">
import Vue from "vue";
import {Component} from "nuxt-property-decorator";
import ProfilePage from "@/pages/user/-components/ProfilePage.vue";
import {newSearchOptions} from "~/modules/assets/asset-helpers";
import {Asset, AssetsResponse} from "~/modules/assets/asset-types";
import {Fragment} from "vue-fragment";
import {getMyUnlockedAssets} from "~/modules/assets/asset-api";
import AssetCard from "~/modules/assets/components/AssetCard.vue"

@Component({
	middleware: ['require_auth'],
	components: {
		ProfilePage,
		Fragment: Fragment,
		AssetCard: AssetCard,
	}
})
export default class UserAssets extends Vue {
	assetsResponse : AssetsResponse = {
		assets: [],
		total: 0
	}

	get assets() : Asset[] {
		if (!this.assetsResponse) {
			return []
		}
		return this.assetsResponse.assets || []
	}

	async fetch () {
		const search = newSearchOptions()
		const myAssets = await getMyUnlockedAssets(search)
		this.assetsResponse = myAssets
	}
}
</script>
