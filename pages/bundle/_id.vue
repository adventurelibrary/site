<template>
	<article class="bundle-page item-page">
		<fragment v-if="bundle">
			<section class="preview" :style="`background-image: url(${bundle.previewLink});`">
				<!-- Empty -->
			</section>
			<section class="info">
				<h1 class="title">{{bundle.name}}</h1>
				<div class="description">
					{{bundle.description}}
				</div>
			</section>
			<section class="actions">
				<button type="button" @click="clickDeleteBundle">Delete</button>
				<button type="button" @click="clickEditBundle">Edit</button>
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
import { Context } from '@nuxt/types'
import Vue from 'vue'
import {Component} from "nuxt-property-decorator";
import {Asset} from "~/modules/assets/asset-types";
import {doAjax, getAjaxData} from "~/lib/ajax";
import AssetDownload from "~/modules/assets/components/AssetDownload.vue";
import TagList from "~/modules/tags/TagList.vue";
import {Fragment} from "vue-fragment";
import AssetCard from "~/modules/assets/components/AssetCard.vue";
import {
	deleteBundle,
	getBundle,
	newBundleAjax,
	removeAssetFromBundle,
} from "~/modules/bundles/bundles-api";
import {Bundle, BundleResponse} from "~/modules/bundles/bundle-types";

@Component({
	components: {
		AssetDownload: AssetDownload,
		TagList: TagList,
		AssetCard,
		Fragment
	}
})
class BundlePage extends Vue {
	bundleAjax = newBundleAjax()
	skip = 0
	perPage = 5
	loadingMore = false
	scrollTimeout : NodeJS.Timeout

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

	get bundle () : Bundle | undefined {
		const data = getAjaxData<BundleResponse>(this.bundleAjax)
		if (!data) {
			return undefined
		}
		return data
	}

	get assets () : Asset[] {
		if (!this.bundle || !this.bundle.assets) {
			return []
		}
		return this.bundle.assets
	}

	// fetching asset data and related assets array
	async asyncData (ctx: Context) {
		const fn = async () => {
			return await getBundle(ctx.params.id)
		}
		const ajax = newBundleAjax()
		await doAjax<BundleResponse>(ajax, fn)
		return {
			bundleAjax: ajax,
		}
	}

	async clickRemoveAsset (asset: Asset) {
		if (!this.bundle) {
			return
		}
		await removeAssetFromBundle(this.bundle.id, asset.id)
		if (this.bundleAjax.data  && this.bundleAjax.data.assets) {
			this.bundleAjax.data.assets = this.bundleAjax.data.assets.filter((a) => {
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
		// TODO: emit the changed bundle and watch for that change here
		// then update the bundle on the page
	}
}

export default BundlePage
</script>
