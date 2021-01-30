<template>
  <div class="asset featured">
    <div class="thumbnail">

    </div>
    <div class="meta">
      <h3><AssetLink :asset="asset">{{asset.title}}</AssetLink></h3>
      <div>
        {{asset.description}}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Component, Prop} from "nuxt-property-decorator";
import Vue from "vue";
import {Asset} from "adventurelibrary/dist/assets/asset-types";
import AssetLink from "~/modules/assets/components/AssetLink.vue";

@Component({
  components: {
    AssetLink: AssetLink
  }
})
class FeaturedAsset extends Vue {
  @Prop() asset : Asset
}
export default FeaturedAsset
</script>
