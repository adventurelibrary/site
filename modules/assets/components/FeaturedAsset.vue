<template>
  <div class="asset featured">
    <div class="meta">
      <h3><AssetLink :asset="asset">{{asset.name}}</AssetLink></h3>
      <div>
        {{asset.description}}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Component, Prop} from "nuxt-property-decorator";
import Vue from "vue";
import {Asset} from "~/modules/assets/asset-types";
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
