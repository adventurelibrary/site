<template>
	<Modal
			:show="true"
			class-name="bundle-add-assets-modal"
			:title="`Add Assets to ${bundle.name}`"
			@close="closeModal">
		<slot>
			<AssetSearch @submit="searchAssets" />
			<LoadingContainer :loading="assetsAjax.loading" :error="assetsAjax.error">
				<h4 v-if="!assets.length">Not showing any assets.</h4>
				<ul class="results">	
					<li v-for="asset in assets" :key="asset.id" class="result">
						<div class="thumbnail" :style="`background-image: url(${asset.thumbnail});`">
							<!-- This Element Intentionally Left Empty -->
						</div>
						<h3>{{asset.name}}</h3>
						<h4>{{asset.category}}</h4>
						<figure class="asset-action">
							<button @click="() => { clickAddAsset(asset) }">
								<i class="ci-plus"></i>
							</button>
						</figure>
					</li>
				</ul>
			</LoadingContainer>
		</slot>
	</Modal>
</template>
<script lang="ts">
import {Component, State} from "nuxt-property-decorator";
import Modal from "~/modules/modals/Modal.vue";
import Vue from "vue";
import MyBundleSelector from "~/modules/bundles/components/MyBundleSelector.vue";
import {Bundle} from "~/lib/bundles/bundle-types";
import {Asset, AssetSearchOptions, AssetsResponse} from "~/lib/assets/asset-types";
import AssetSearch from "~/modules/assets/components/search/AssetSearch.vue";
import {newAssetsAjax, searchAssets} from "~/lib/assets/asset-api";
import {computeAjaxList, doAjax} from "~/lib/ajax";
import LoadingContainer from "~/components/LoadingContainer.vue";

@Component({
	components: {
		LoadingContainer,
		AssetSearch: AssetSearch,
		MyBundleSelector,
		Modal: Modal,
	}
})
export default class BundleAddAssetsModal extends Vue {
	assetsAjax = newAssetsAjax()

	@State('bundleAddAssetsBundle') bundle : Bundle

	closeModal () {
		this.$store.dispatch('closeAllModals')
	}

	async clickAddAsset (asset: Asset) {
		this.notifySuccess(`Adding ${asset.name} to ${this.bundle.name}`)
	}

	async searchAssets (options : AssetSearchOptions) {
		options.size = 10

		const fn = async () => {
			return await searchAssets(options)
		}
		await doAjax<AssetsResponse>(this.assetsAjax, fn, false)
	}


	get assets () : any[] {
		return computeAjaxList(this.assetsAjax, 'assets')
	}
}
</script>
