<template>
	<article class="bundle-page item-page">
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
				<ul class="search-results">
					<li v-if="!assets.length">No assets.</li>
					<!-- <li v-for="asset in relatedAssets.assets" :key="asset.id" :asset="asset">{{asset.name}}</li> -->
					<AssetCard v-for="asset in assets" :key="asset.id" :asset="asset">
						<Fragment slot="extra-actions">
							<button @click="() => clickRemoveAsset(asset)" class="asset-action action-remove-asset-from-bundle">
								<i class="ci-off_close"></i>
							</button>
						</Fragment>
					</AssetCard>
				</ul>
			</section>
		</fragment>
		<fragment v-else>
			<div>Could not find that bundle.</div>
		</fragment>
	</article>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component, Getter} from "nuxt-property-decorator";
import {Asset} from "~/modules/assets/asset-types";
import AssetDownload from "~/modules/assets/components/AssetDownload.vue";
import TagList from "~/modules/tags/TagList.vue";
import {Fragment} from "vue-fragment";
import AssetCard from "~/modules/assets/components/AssetCard.vue";
import {
	deleteBundle,
	getBundle,
	removeAssetFromBundle,
} from "~/modules/bundles/bundles-api";
import {Bundle} from "~/modules/bundles/bundle-types";

@Component({
	components: {
		AssetDownload: AssetDownload,
		TagList: TagList,
		AssetCard,
		Fragment
	}
})
class BundlePage extends Vue {
	bundle : Bundle

	@Getter('isLoggedIn') isLoggedIn : boolean

	async fetch () {
		const res = await getBundle(this.$nuxt.context.params.id)
		if (res) {
			this.bundle = res
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

	get assets () : Asset[] {
		if (!this.bundle || !this.bundle.assets) {
			return []
		}
		return this.bundle.assets
	}

	get isOwner () : boolean {
		if (!this.isLoggedIn) {
			return false
		}

		return this.bundle.user_id === this.$store.state.user.id
	}

	async clickRemoveAsset (asset: Asset) {
		if (!this.bundle) {
			return
		}
		await removeAssetFromBundle(this.bundle.id, asset.id)
		if (this.bundle  && this.bundle.assets) {
			this.bundle.assets = this.bundle.assets.filter((a: any) => {
					return a.id !== asset.id
			})
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
