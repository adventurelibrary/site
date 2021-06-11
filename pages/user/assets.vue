<template>
	<ProfilePage active-tab="settings">
		<h1>My Assets</h1>
		<nuxt-link :to="{name: 'upload'}">Upload Assets</nuxt-link>
		<div class="assets">
			<AssetManageItem v-for="asset in assets" :key="asset.id" :asset="asset"></AssetManageItem>
		</div>
	</ProfilePage>
</template>
<script lang="ts">
import Vue from "vue";
import {Component} from "nuxt-property-decorator";
import ProfilePage from "@/pages/user/components/ProfilePage.vue";
import {newAssetsAjax, searchAssets} from "@/lib/assets/asset-api";
import {computeAjaxList, computeAjaxTotal, doAjax} from "@/lib/ajax";
import {newSearchOptions} from "@/lib/assets/asset-helpers";
import {Asset} from "@/lib/assets/asset-types";
import AssetManageItem from "~/modules/assets/components/AssetManageItem.vue";

@Component({
	middleware: ['require_auth'],
	components: {
		ProfilePage,
		AssetManageItem: AssetManageItem
	}
})
export default class UserAssets extends Vue {
	assetsAjax = newAssetsAjax()
	async asyncData () {
		const ajax = newAssetsAjax()
		await doAjax(ajax, async () => {
			const search = newSearchOptions()
			search.mine = true
			search.visibility = 'all'
			return await searchAssets(search)
		})
		return {
			assetsAjax: ajax
		}
	}

	get assets () : Asset[] {
		return computeAjaxList(this.assetsAjax, 'assets')
	}

	get totalAssets () : number {
		return computeAjaxTotal(this.assetsAjax)
	}

}
</script>
