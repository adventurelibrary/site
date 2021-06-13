<template>
	<ProfilePage active-tab="bundles">
		<LoadingContainer :loading="bundlesAjax.loading" :error="bundlesAjax.error">
			<div>Showing {{bundles.length}}. Total: {{totalBundles}}</div>
      <ol class="bundles-list">
        <BundleCard v-for="bundle in bundles" :key="bundle.id" :bundle="bundle" v-on:deleted="() => hideBundle(bundle.id)" />
      </ol>
			<Pagination
        :items-per-page="20"
        :total-items="totalBundles"
        :active-page="activePage"
        :to="{name: 'bundles'}"
			/>
		</LoadingContainer>
	</ProfilePage>
</template>
<script lang="ts">
import {Component, mixins} from "nuxt-property-decorator";
import {computeAjaxList, computeAjaxTotal, doAjax} from "~/lib/ajax";
import {Bundle, BundlesResponse} from "~/modules/bundles/bundle-types";
import {getMyBundles, newBundlesAjax} from "~/modules/bundles/bundles-api";
import PaginationMixin, {getRouteQueryPage} from "~/mixins/PaginationMixin.vue";
import {Context} from "@nuxt/types";
import BundleCard from "~/modules/bundles/components/BundleCard.vue";
import ProfilePage from "~/pages/user/components/ProfilePage.vue";
import LoadingContainer from "~/components/LoadingContainer.vue";

@Component({
	middleware: ['require_auth'],
	components: {
		ProfilePage,
		BundleCard,
		LoadingContainer: LoadingContainer
	}
})
export default class MyBundles extends mixins(PaginationMixin) {
	bundlesAjax = newBundlesAjax()

	// This function fires client side when the ?page query parameter is changed
	// Nuxt won't do a full route change cycle (which would call asyncData) if only
	// the query params change. So, we watch the query params ourselves with the PaginationMixin
	// and just do an ajax call when the page changes
	async pageChanged () {
		doAjax<BundlesResponse>(this.bundlesAjax, async () => {
			return await getMyBundles(this.activePage)
		})
	}

	async asyncData (ctx : Context) {
		const ajax = newBundlesAjax()
		const page = getRouteQueryPage(ctx.route)
		if (process.client) {
			/*doAjax<BundlesResponse>(ajax, async () => {
				return await getMyBundles(page)
			})*/
		} else {
			await doAjax<BundlesResponse>(ajax, async () => {
				return await getMyBundles(page)
			})
		}
		return {
			bundlesAjax: ajax
		}
	}

	get bundles () : Bundle[] {
		const list = computeAjaxList(this.bundlesAjax, 'bundles')
		return list
	}

	get totalBundles () : number {
		return computeAjaxTotal(this.bundlesAjax)
	}

	hideBundle (id: string) {
		if (!this.bundlesAjax.data || !this.bundlesAjax.data.bundles) {
			return
		}
		this.bundlesAjax.data.bundles = this.bundlesAjax.data.bundles.filter(x => x.id != id)
	}
}
</script>
</style>
