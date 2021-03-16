<template>
	<AssetSearch :options="searchOptions" @submit="submitSearch" />
</template>
<script lang="ts">
import Vue from "vue"
import AssetSearch from "~/modules/assets/components/search/AssetSearch.vue"
import {Component} from "nuxt-property-decorator";
import {AssetSearchOptions} from "~/lib/assets/asset-types";
import {assetSearchOptionsToQuery, newSearchOptions} from "~/lib/assets/asset-helpers";
import {getRouteAssetSearchOptions} from "~/modules/assets/helpers";

@Component({
	components: {
		AssetSearch: AssetSearch
	}
})
export default class AssetSearchRouter extends Vue {
	public searchOptions : AssetSearchOptions = newSearchOptions()

	created () {
		this.searchOptions = getRouteAssetSearchOptions(this.$route)
	}

	submitSearch (options: AssetSearchOptions) {
		this.$router.push({
			name: 'assets',
			query: assetSearchOptionsToQuery(options)
		})
	}
}
</script>
