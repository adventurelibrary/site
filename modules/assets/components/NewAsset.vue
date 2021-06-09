<template>
	<li class="new-asset">
		<form ref="fileform" class="new-asset-file">
			<div class="drop-files">
				<div class="preview">
					<AssetFilePreview :file="newAsset.file" />
				</div>
				<h4>Drag &amp; drop your files here</h4>
				<input type="file" :accept="acceptedImageTypes" multiple @change="fileInputChanged" />
			</div>
			<AssetFields
				:asset="newAsset.asset"
				v-on:assetChanged="assetChanged"
				:hide-visibility="true"
			/>
		</form>
	</li>
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
