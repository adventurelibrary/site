<template>
  <div class="tag-search">
    <div class="results">
      <div v-for="tag in results" :key="tag.key" @click="() => clickTag(tag)">
        {{tag.label}}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Component, Prop, Watch} from "nuxt-property-decorator";
import Vue from "vue"
import {AssetTag} from "adventurelibrary/dist/assets/asset-types";

@Component
export default class TagSearch extends Vue {
  error : string = '';
  results : AssetTag[] = [];

  @Prop() query : string // What they are searching for

  @Watch('query')
  queryWatch () {
    this.searchTags()
  }

  async searchTags () {
    if (this.query == '') {
      this.results = []
      return
    }
    this.results = [{
      key: 'winter',
      label: 'Winter'
    }]
  }

  clickTag(tag: AssetTag) {
    this.$emit('clickTag', tag)
  }
}
</script>
