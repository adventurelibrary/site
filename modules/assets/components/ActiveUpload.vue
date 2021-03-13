<template>
	<div class="uploading-asset" style="padding: 3em; font-size: 2em; text-align: center;">
		<div><h3>{{upload.title}}</h3></div>
		<div v-if="upload.status === 'waiting'">Waiting...</div>
		<div v-if="upload.status === 'signing'">Fetching signature...</div>
		<div v-if="upload.status === 'signed'">Preparing upload...</div>
		<div v-if="upload.status === 'uploading'">
			Uploading ({{upload.progress}}%)<br />{{upload.signature}}
			<div style="border: 1px solid black; height: 20px;">
				<div :style="'background: black; float: left; height: 20px; width: ' + upload.progress + '%'"></div>
			</div>
		</div>
		<div v-if="upload.status === 'complete'">Done!</div>
		<div v-if="upload.status === 'error'">Error: {{upload.error}}</div>
	</div>
</template>
<script lang="ts">
import Vue, {PropType} from "vue"
import {ActiveUpload} from "~/lib/assets/asset-uploads";

export default Vue.extend({
	name: 'ActiveUpload',
	props: {
		upload: {
			type: Object as PropType<ActiveUpload>,
			required: true
		}
	},
	watch: {
		'upload.status' () {
			console.log('status changed')
		}
	},
	computed: {
		status () : string {
			return this.upload.status
		}
	}
})
</script>
