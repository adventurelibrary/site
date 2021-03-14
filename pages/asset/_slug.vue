<template>
  <div class="container">
		<AssetDetails :asset="asset" />
  </div>
</template>
<script lang="ts">
import { Context } from '@nuxt/types'
import Vue from 'vue'
import {Component} from "nuxt-property-decorator";

import {Asset} from "~/lib/assets/asset-types";
import {getAsset} from "~/lib/assets/asset-api";

@Component
class AssetPage extends Vue {
  public asset : Asset

  head () {
    const asset = this.asset
    return {
      title: asset.title + ' - Asset',
      description: asset.description
    }
  }

  async asyncData (ctx: Context) {
    const assetRes = await getAsset(ctx.params.slug)
    return {
      asset: assetRes.asset
    }
  }
}

export default AssetPage
</script>
