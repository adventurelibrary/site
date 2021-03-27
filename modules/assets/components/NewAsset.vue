<template>
	<div class="new-asset">
		<form ref="fileform" class="new-asset-file">
      <div class="preview">
				<AssetFilePreview :file="newAsset.file" />
			</div>
			<input type="file" :accept="acceptedImageTypes" multiple @change="fileInputChanged" />
			<div class="drop-files">Drop here to replace</div>
		</form>
		<div class="new-asset-fields">
			<AssetFields
					:asset="newAsset.asset"
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
import {ACCEPTED_IMAGE_TYPES} from "~/lib/assets/asset-consts";

export default Vue.extend({
	name: 'NewAsset',
	props: {
		newAsset: {
			type: Object as PropType<NewAsset>,
			required: true
		}
	},
	components: {
    AssetFilePreview,
		AssetFields: AssetFields,
	},
	data () {
		return {
			acceptedImageTypes: ACCEPTED_IMAGE_TYPES
		}
	},
	mounted () {
		const fileform = this.$refs.fileform as any
		stopEvents(fileform)
		fileform.addEventListener('drop', (e: any) => {
			this.changeFiles(e.dataTransfer.files)
		})
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
<style>
.new-asset {
	display: flex;
	flex-direction: row;
	padding-bottom: 2em;
	margin-bottom: 2em;
	border-bottom: 1px solid #333;
}

.new-asset-file,
.new-asset-fields {
	flex: 0 0 50%;
}

.new-asset-fields {
	padding-left: 1em;
}

.new-asset-file {
	padding-right: 1em;
	text-align: center;
}

.new-asset-file img {
	max-height: 100%;
	max-width: 100%;
}

.new-asset-file .drop-files {
	padding: 1em;
}
</style>
