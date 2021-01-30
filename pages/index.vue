<template>
  <div class="container">
    <h1>Home Page</h1>
    <div>
      <h3>Featured Assets ({{numFeatured}})</h3>
      <div>
        <FeaturedAsset v-for="asset in featured" :asset="asset" :key="asset.slug" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Component} from "nuxt-property-decorator";
import {Asset} from "adventurelibrary/build/assets/asset-types";
import {getFeaturedAssets} from "adventurelibrary/dist/assets/asset-api";
import {Context} from "@nuxt/types";
import FeaturedAsset from "~/modules/assets/components/FeaturedAsset.vue";

@Component({
  components: {
    FeaturedAsset: FeaturedAsset
  }
})
class HomePage extends Vue {
  public featured: Asset[]
  public numFeatured : number

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
}

export default HomePage
</script>

<style>
</style>
