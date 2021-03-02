<template>
  <div class="container">
		<section class="hero">
    	<div class="titles">
				<h1>Adventure Library</h1>
				<h3>Tabletop RPG maps, tokens, portraits, and more.</h3>
			</div>
			<AssetSearch :options="searchOptions" v-on:submit="submitSearch" />
		</section>
    <section class="featured-assets">
      <h3>Featured Assets ({{numFeatured}})</h3>
      <div>
        <FeaturedAsset v-for="asset in featured" :asset="asset" :key="asset.slug" />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Component} from "nuxt-property-decorator";
import {Asset, AssetSearchOptions} from "adventurelibrary/dist/assets/asset-types";
import {getFeaturedAssets} from "adventurelibrary/dist/assets/asset-api";
import {Context} from "@nuxt/types";
import FeaturedAsset from "~/modules/assets/components/FeaturedAsset.vue";
import AssetSearch from "~/modules/assets/components/search/AssetSearch.vue";
import {assetSearchOptionsToQuery, newSearchOptions} from "adventurelibrary/dist/assets/asset-helpers";

@Component({
  components: {
    FeaturedAsset,
		AssetSearch,
  }
})
class HomePage extends Vue {
  public featured: Asset[]
  public numFeatured : number
	public searchOptions : AssetSearchOptions = newSearchOptions()

  async asyncData(_ctx: Context) {
    const assetsRes = await getFeaturedAssets()
    setTimeout(() => {
      console.log('hi')
    }, 100)
    return {
      numFeatured: assetsRes.total,
      featured: assetsRes.results
    }
  }

	submitSearch (options: AssetSearchOptions) {
		this.$router.push({
			name: 'assets',
			query: assetSearchOptionsToQuery(options)
		})
	}
}

export default HomePage
</script>

<style>
.asset-search {
	margin: 1em;
	padding: 1em;
	border: 1px solid #ccc;
	background: #E0E0E0;
}

.hero {
	padding: 2em 0;
}

.hero .titles {
	text-align: center;
}

.titles h1 {
	font-size: 36px;
}

.titles h2 {
	font-size: 26px;
}

</style>
