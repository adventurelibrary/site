<template>
	<div class="d-flex">
		<form ref="fileform" class="p-2" style="flex: 0 0 50%;">
			<input type="file" multiple @change="fileInputChanged" />
      <AssetFilePreview :file="asset.file" />
			<div class="drop-files" style="border: 1px solid #ccc; padding: 5em; text-align: center;">Current file: {{asset.file.name}} {{asset.file.size}}<br />Drop Here to replace</div>
		</form>
		<div class="p-2" style="flex: 0 0 50%;">
			<AssetFields
					:asset="asset"
					v-on:assetChanged="assetChanged"
			/>
		</div>
	</div>
</template>
<script lang="ts">
import Vue, {PropType} from "vue"
import {stopEvents} from "~/lib/file-helpers";
import {NewAsset} from "~/lib/assets/asset-types";
import AssetFields from "./AssetFields.vue";
import AssetFilePreview from "~/modules/assets/components/AssetFilePreview.vue";

export default Vue.extend({
	name: 'NewAsset',
	props: {
		asset: {
			type: Object as PropType<NewAsset>,
			required: true
		}
	},
	components: {
    AssetFilePreview,
		AssetFields: AssetFields,
	},

	mounted () {
		const fileform = this.$refs.fileform as any
		stopEvents(fileform)
		fileform.addEventListener('drop', (e: any) => {
			this.changeFiles(e.dataTransfer.files)
		})
    console.log('this asset file', this.asset.file)
	},
	methods: {
		updateFile (file: any) {
			this.$emit('updateFile', file)
		},
		addFile (file: any) {
			this.$emit('addFile', file)
		},
		fileInputChanged (e: any) {
			this.changeFiles(e.target.files)
		},
		assetChanged (newVal: any) {
			this.$emit('updateFields', newVal)
		},
		changeFiles (files: File[]) {
			for( let i = 0; i < files.length; i++ ){
				const file = files[i]
				if (i == 0) {
					this.updateFile(file)
				} else {
					this.addFile(file)
				}
			}
		}
	},
})
</script>
