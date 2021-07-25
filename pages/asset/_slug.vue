<template>
	<article class="asset item-page" v-if="asset">
		<section class="preview" :style="`background-image: url(${asset.previewLink});`">
			<!-- Empty -->
		</section>

		<LoadingContainer :loading="$fetchState.pending" :error="$fetchState.error">
		</LoadingContainer>

		<section class="info">
			<h1 class="title">{{asset.name}}</h1>			

			<h3 class="author">				
				By<a href=""><i class="author-icon ci-user"></i>{{asset.creator_name}}</a>
				<!-- By<i class="author-icon ci-user"><nuxt-link :to="{name: 'creator-about', params: {creatorId: asset.creator_id}}">{{asset.creator_name}}</nuxt-link></i> -->
				<!--<nuxt-link :to="{name: 'creator-about', params: {creatorId: asset.creator_id}}"><i class="author-icon ci-user">{{asset.creator_name}}</i></nuxt-link>-->
			</h3>

			<div class="description">
				{{asset.description}}
			</div>

			<TagList :tags="asset.tags" />

			<div class="control">
				<AssetArchiveButton :asset="asset" />
				<AssetReportButton :asset="asset" />
			</div>
		</section>

		<section class="actions">
			<AssetDownload :asset="asset" />
			<span class="download-count">
				<span class="count">{{asset.downloads || 0}}</span>
				<span class="label">downloads</span>
			</span>
		</section>

		<section class="similar-assets">
			<!-- Similar assets -->
			<ul class="search-results">
				<!-- <li v-for="asset in relatedAssets.assets" :key="asset.id" :asset="asset">{{asset.name}}</li> -->
				<AssetCard v-for="asset in relatedAssets.assets" :key="asset.id" :asset="asset"/>
			</ul>
		</section>

	</article>
</template>
<script lang="ts">
import { Context } from '@nuxt/types'
import Vue from 'vue'
import {Component} from "nuxt-property-decorator";

import {Asset} from "~/modules/assets/asset-types";
import {getAssetBySlug} from "~/modules/assets/asset-api";
import AssetDownload from "~/modules/assets/components/AssetDownload.vue";
import AssetArchiveButton from "~/modules/assets/components/AssetArchiveButton.vue";
import AssetReportButton from "~/modules/assets/components/AssetReportButton.vue";
import TagList from "~/modules/tags/TagList.vue";

// related assets and search modules
import {AssetsResponse} from "~/modules/assets/asset-types";
import {getRelatedAssetsByTags} from "~/modules/assets/asset-api";
import AssetCard from "~/modules/assets/components/AssetCard.vue";

import Modals from "~/modules/modals/Modals.vue";
import {Fragment} from "vue-fragment";

@Component({
	components: {
		AssetDownload: AssetDownload,
		TagList: TagList,
		AssetCard,
		Modals: Modals,
		AssetArchiveButton: AssetArchiveButton,
		AssetReportButton: AssetReportButton,
		Fragment: Fragment
	}
})
class AssetPage extends Vue {
	relatedAssets : Asset[]
	asset : null | Asset
	slug: string

	// setting header meta tags
	head () {
		const asset = this.asset
		if (asset == null) {
			return {
				title: '404 Asset',
				description: ''
			}
		}
		return {
			title: asset.name + ' - Asset',
			description: asset.description,
			og: asset.thumbnail,

			// meta tags nuxt implementation
			meta: [
				{ charset: 'utf-8' },
				{
					hid: 'description',  // hid is used as unique identifier. Do not use `vmid` for it as it will not work
					name: asset.name + ' - Asset',
					description: asset.description,
					og: asset.thumbnail
				},

				// Twitter specific:
				// https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup
				{ name: 'twitter:title', content: asset.name + ' - Asset' },
				{ name: 'twitter:description', content: asset.description},
				{ name: 'twitter:image', content: asset.thumbnail},
				{ name: 'twitter:card', content: asset.thumbnail},

				// Facebook specific tags:
				// https://developers.facebook.com/docs/sharing/webmasters/
				{ name: 'og:title', content: asset.name + ' - Asset' },
				{ name: 'og:description', content: asset.description},
				{ name: 'og:image', content: asset.thumbnail},

			]
		}
	}

	async fetch () {
		this.asset = await getAssetBySlug(this.$nuxt.context.params.slug)
		const relatedRes = await getRelatedAssetsByTags(this.asset)
		this.relatedAssets = relatedRes.assets
	}

	// fetching asset data and related assets array
	async asyncData (ctx: Context) {
		return {
			slug: ctx.params.slug,
			asset: null,
			relatedAssets: []
		}
	}

}

export default AssetPage
</script>
