<template>
  <img class="preview" width="100" height="100" alt="Preview" />
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Prop, Watch} from "nuxt-property-decorator";

@Component
export default class AssetFilePreview extends Vue {
  reader : FileReader = new FileReader()

  @Prop() file : File

  @Watch('file', {
    immediate: true
  })
  watchFile () {
    if (!this.file) {
      return
    }
    if (!this.reader.onload) {
      this.reader.onload = (e) => {
        const img = this.$el
        let result = ''
        if (img && e.target) {
          if (e.target.result) {
            result = e.target.result.toString()
          }
          img.setAttribute('src', result);
        } else {
        }
      }
    }
    this.reader.readAsDataURL(this.file)
  }
}
</script>
