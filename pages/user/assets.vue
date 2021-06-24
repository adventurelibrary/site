<template>
	<ProfilePage active-tab="assets">
		<Fragment slot="actions">
			<nuxt-link v-if="isCreator" :to="{name: 'upload'}" class="button upgrade">Upload Assets</nuxt-link>
		</Fragment>
		<h1>My Assets</h1>
		<ul class="assets">
			<AssetManageItem v-for="asset in assets" :key="asset.id" :asset="asset"></AssetManageItem>
		</ul>
	</ProfilePage>
</template>
<script lang="ts">
import Vue from "vue";
import {Component, Getter} from "nuxt-property-decorator";
import ProfilePage from "@/pages/user/components/ProfilePage.vue";
import {newAssetsAjax, searchAssets} from "~/modules/assets/asset-api";
import {computeAjaxList, computeAjaxTotal, doAjax} from "@/lib/ajax";
import {newSearchOptions} from "~/modules/assets/asset-helpers";
import {Asset} from "~/modules/assets/asset-types";
import AssetManageItem from "~/modules/assets/components/AssetManageItem.vue";
import {Fragment} from "vue-fragment";

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

	created () {
		// This event is emitted from the EditAssetModal when the form is successfully submitted
		// The data passed in is the data from the edit form
		this.$root.$on('assetUpdated', (data: any) => {
			if (!this.assetsAjax.data || !this.assetsAjax.data.assets) {
				return
			}
			for (let i = 0; i < this.assetsAjax.data.assets.length; i++) {
				const asset = this.assetsAjax.data.assets[i]
				if (asset.id === data.id) {
					for (let k in data) {
						Vue.set(this.assetsAjax.data.assets[i], k, data[k])
					}
					break
				}
			}
		})
	}

	get assets () : Asset[] {
		return computeAjaxList(this.assetsAjax, 'assets')
	}

	get totalAssets () : number {
		return computeAjaxTotal(this.assetsAjax)
	}

}
</script>
