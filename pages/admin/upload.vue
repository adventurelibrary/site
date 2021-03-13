<template>
<div>
	<h1>Upload Assets</h1>
	<div>
		<UploadAssets />
	</div>
</div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component} from "nuxt-property-decorator";
import UploadAssets from "~/modules/assets/components/UploadAssets.vue";

@Component({
	components: {
		UploadAssets: UploadAssets
	}
})
class Upload extends Vue {
  layout () {
    console.log('use admin')
    return 'admin'
  }
}

export default Upload
</script>
