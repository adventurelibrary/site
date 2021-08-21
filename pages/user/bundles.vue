<template>
	<ProfilePage active-tab="bundles">
		<Fragment slot="actions">
			<a class="button upgrade" @click="createBundle">Create Bundle</a>
		</Fragment>
		<LoadingContainer :loading="$fetchState.pending" :error="$fetchState.error">
			<div>Showing {{bundles.length}}. Total: {{bundlesResponse.total}}</div>
      <ol class="bundles-list">
        <BundleCard v-for="bundle in bundles" :key="bundle.id" :bundle="bundle" v-on:deleted="() => hideBundle(bundle.id)" />
      </ol>
			<Pagination
        :items-per-page="20"
        :total-items="bundlesResponse.total"
        :active-page="activePage"
        :to="{name: 'user-bundles'}"
			/>
		</LoadingContainer>
	</ProfilePage>
</template>
<script lang="ts">
import {Component, mixins} from "nuxt-property-decorator";
import {Bundle, BundlesResponse} from "~/modules/bundles/bundle-types";
import {getMyBundles} from "~/modules/bundles/bundles-api";
import PaginationMixin from "~/mixins/PaginationMixin.vue";
import BundleCard from "~/modules/bundles/components/BundleCard.vue";
import ProfilePage from "~/pages/user/-components/ProfilePage.vue";
import LoadingContainer from "~/components/LoadingContainer.vue";
import {Fragment} from "vue-fragment";

@Component({
	middleware: ['require_auth'],
	components: {
		ProfilePage,
		Fragment: Fragment,
		BundleCard,
		LoadingContainer: LoadingContainer
	}
})
export default class MyBundles extends mixins(PaginationMixin) {
	bundlesResponse : BundlesResponse = {
		bundles: [],
		total: 0
	}

	// This function fires client side when the ?page query parameter is changed
	// Nuxt won't do a full route change cycle (which would call asyncData) if only
	// the query params change. So, we watch the query params ourselves with the PaginationMixin
	// and just do an ajax call when the page changes
	async pageChanged () {
		this.$fetch()
	}

	async fetch () {
		this.bundlesResponse = await getMyBundles(this.activePage)
	}

	get bundles () : Bundle[] {
		if (!this.bundlesResponse) {
			return []
		}
		return this.bundlesResponse.bundles
	}

	hideBundle (id: string) {
		if (!this.bundlesResponse || !this.bundlesResponse.bundles) {
			return
		}
		this.bundlesResponse.bundles = this.bundlesResponse.bundles.filter(x => x.id != id)
	}

	createBundle () {
		alert('Not implemented')
	}
}
</script>
