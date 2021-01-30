<template>
  <div class="container">
    <h1>{{asset.title}}</h1>
    <div>
      {{asset.description}}
    </div>
  </div>
</template>
<script lang="ts">
import { Context } from '@nuxt/types'
import Vue from 'vue'
import {Component} from "nuxt-property-decorator";

import {Asset} from "adventurelibrary/dist/assets/asset-types";
import {getAsset} from "adventurelibrary/dist/assets/asset-api";


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
    console.log('assetRes', assetRes)
    return {
      asset: assetRes.asset
    }
  }
}

export default AssetPage
</script>
