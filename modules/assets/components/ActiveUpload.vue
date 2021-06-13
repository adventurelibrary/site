<template>
	<div class="uploading-asset" style="">
		<div class="preview">
			<AssetFilePreview :file="upload.file" />
		</div>
		<h3>{{upload.title}}</h3>
		<div v-if="upload.status === 'waiting'">Waiting...</div>
		<div v-if="upload.status === 'signing'">Fetching signature...</div>
		<div v-if="upload.status === 'signed'">Preparing upload...</div>
		<div v-if="upload.status === 'uploading'">
			Uploading...
		</div>
		<div v-if="upload.status === 'complete'">Done!</div>
		<div v-if="upload.status === 'error'">Error: {{upload.error}}</div>
	</div>
</template>
<script lang="ts">
import Vue, {PropType} from "vue"
import {ActiveUpload} from "~/modules/assets/asset-uploads";
import AssetFilePreview from "~/modules/assets/components/AssetFilePreview.vue";

export default Vue.extend({
	name: 'ActiveUpload',
	components: {AssetFilePreview},
	props: {
		upload: {
			type: Object as PropType<ActiveUpload>,
			required: true
		}
	},
	watch: {
		'upload.status' () {
		}
	},
	computed: {
		status () : string {
			return this.upload.status
		}
	}
})
</script>
<style>
.uploading-asset {
	padding: 3em;
	font-size: 2em;
	text-align: center;
	border: 1px solid #ccc;
	margin: 0 0 1em 0;
}

.uploading-asset .preview {
	height: 40px;
}

.uploading-asset .preview img {
	max-height: 100%;
	max-width: 100%;
}
</style>
