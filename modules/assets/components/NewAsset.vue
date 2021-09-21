<template>
	<li class="new-asset">
		<form ref="fileform" class="new-asset-file">
			<div class="drop-files">
				<div class="preview">
					<AssetFilePreview :file="newAsset.file" />
				</div>
				<label :for="fileInputId" class="file-input-label">Drag &amp; drop replacement file here.</label>
				<input :id="fileInputId" type="file" :accept="acceptedImageTypes" multiple @change="fileInputChanged" />
			</div>
			<AssetFields
				v-model="newAsset.asset"
				@change="assetChanged"
			/>
		</form>
	</li>
</template>
<script lang="ts">
import Vue, {PropType} from "vue"
import {stopEvents} from "~/lib/file-helpers";
import {NewAsset} from "~/modules/assets/asset-types";
import AssetFields from "./AssetFields.vue";
import AssetFilePreview from "~/modules/assets/components/AssetFilePreview.vue";
import {ACCEPTED_IMAGE_TYPES} from "~/modules/assets/asset-consts";

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
			acceptedImageTypes: ACCEPTED_IMAGE_TYPES,
			fileInputId: 'file-' + new Date().getTime().toString()
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
