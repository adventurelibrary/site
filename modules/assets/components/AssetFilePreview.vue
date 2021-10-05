<template>
	<div class="asset-file-preview">
		<img class="preview" alt="Preview" v-show="loaded" />
		<span class="preview-loading" v-show="!loaded">Loading Preview</span>
	</div>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Prop, Watch} from "nuxt-property-decorator";
import {Fragment} from "vue-fragment";

@Component({
	components: {
		Fragment: Fragment
	}
})
export default class AssetFilePreview extends Vue {
  reader : FileReader = new FileReader()
	// This will be set to true once the selected file has been loaded into memory
	// Doing this prevents the <img /> from being shown when it has no src
	loaded = false

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
				const img = this.$el.querySelector('img')
				let result = ''
				if (img && e.target) {
					if (e.target.result) {
						result = e.target.result.toString()
					}
					img.setAttribute('src', result);
					this.loaded = true
				}
      }
    }
    this.reader.readAsDataURL(this.file)
  }
}
</script>
