<template>
	<article class="bundle-page item-page">
		<LoadingContainer :loading="$fetchState.loading" :error="$fetchState.error">
			<fragment v-if="bundle">
				<section class="preview" :style="`background-image: url(${bundle.cover_thumbnail});`">
					<!-- Empty -->
				</section>
				<section class="info">
					<h1 class="title">{{bundle.name}}</h1>
					<div class="description">
						{{bundle.description}}
					</div>
				</section>
				<section class="actions">
					<Fragment v-if="isOwner">
						<button type="button" @click="clickDeleteBundle">Delete</button>
						<button type="button" @click="clickEditBundle">Edit</button>
					</Fragment>
				</section>

				<section class="bundle-assets">
					<SelectAssetsContainer>
						<fragment slot="actions">
							<button type="button" @click="clickRemoveSelectedAssets">Remove From Bundle</button>
						</fragment>
						<AssetList :assets="assets">
							<template v-slot:extra-actions="{asset}">
								<button @click="() => clickRemoveAsset(asset)" class="asset-action action-remove-asset-from-bundle">
									<i class="ci-off_close"></i>
								</button>
							</template>
						</AssetList>
					</SelectAssetsContainer>
				</section>
			</fragment>
		</LoadingContainer>
	</article>
</template>
<script lang="ts">
import {Component, Getter, mixins, State} from "nuxt-property-decorator";
import {Asset} from "~/modules/assets/asset-types";
import AssetDownload from "~/modules/assets/components/AssetDownload.vue";
import TagList from "~/modules/tags/TagList.vue";
import {Fragment} from "vue-fragment";
import AssetCard from "~/modules/assets/components/AssetCard.vue";
import {deleteBundle, getBundle, removeAssetFromBundle, removeAssetsFromBundle,} from "~/modules/bundles/bundles-api";
import {Bundle} from "~/modules/bundles/bundle-types";
import SelectAssetsContainer from "~/modules/assets/components/select/SelectAssetsContainer.vue";
import LoggedInFetchMixin from "~/mixins/LoggedInFetchMixin.vue";
import AssetList from "../../modules/assets/components/AssetList.vue";

@Component({
	components: {
		AssetList,
		AssetDownload: AssetDownload,
		TagList: TagList,
		AssetCard,
		Fragment,
		SelectAssetsContainer: SelectAssetsContainer
	}
})
class BundlePage extends mixins(LoggedInFetchMixin) {
	bundle : Bundle | null = null

	@Getter('isLoggedIn') isLoggedIn : boolean
	@State('assets', {
		namespace: 'assets'
	}) assets : Asset[]

	async fetch () {
		const res = await getBundle(this.$nuxt.context.params.id)
		if (res) {
			this.bundle = res
			this.$store.dispatch('assets/setAssets', res.assets)
		}
	}

	// setting header meta tags
	head () {
		const bundle = this.bundle
		if (bundle == null) {
			return {
				title: '404 Bundle',
				description: ''
			}
		}
		return {
			title: bundle.name + ' - Bundle',
			description: bundle.description,

			// meta tags nuxt implementation
			meta: [
				{
					hid: 'description',  // hid is used as unique identifier. Do not use `vmid` for it as it will not work
					name: bundle.name + ' - Bundle',
					description: bundle.description,
				},

				// Twitter specific:
				// https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup
				{ name: 'twitter:title', content: bundle.name + ' - Bundle' },
				{ name: 'twitter:description', content: bundle.description},

				// Facebook specific tags:
				// https://developers.facebook.com/docs/sharing/webmasters/
				{ name: 'og:title', content: bundle.name + ' - Bundle' },
				{ name: 'og:description', content: bundle.description},
			]
		}
	}

	get isOwner () : boolean {
		if (!this.isLoggedIn || !this.bundle) {
			return false
		}

		return this.bundle.entity_id === this.$store.state.user.id
	}

	async clickRemoveAsset (asset: Asset) {
		if (!this.bundle) {
			return
		}
		await removeAssetFromBundle(this.bundle.id, asset.id)
		this.$store.dispatch('assets/removeAssets', [asset.id])
		this.notifySuccess(`${asset.name} removed`)
	}

	async clickRemoveSelectedAssets () {
		const ids = this.$store.getters['assets/selectedAssetIds']
		if (!ids.length) {
			return
		}

		await removeAssetsFromBundle(this.bundle.id, ids)
		this.$store.dispatch('assets/removeAssets', ids)
		if (ids.length === 1) {
			this.notifySuccess('One asset removed')
		} else {
			this.notifySuccess(`${ids.length} assets removed`)
		}
	}

	async clickDeleteBundle () {
		if (prompt('Type DELETE to delete bundle') !== 'DELETE') {
			return
		}

		if (!this.bundle) {
			return
		}

		await deleteBundle(this.bundle.id)
		this.notifySuccess('Bundle deleted')
		this.$router.push({name: 'bundles'})
	}

	async clickEditBundle () {
		this.$store.dispatch('openEditBundleModal', {
			bundle: this.bundle
		})
	}
}

export default BundlePage
</script>
