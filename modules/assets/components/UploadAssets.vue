<template>
	<div>
		<div v-show="stage === 'adding'">
			<div v-show="newAssets.length !== 0">
				<NewAssetComponent
						v-for="(asset, idx) in newAssets"
						:new-asset="asset"
						:key="idx"
						v-on:addFile="addFile"
						v-on:updateFile="(file) => updateFile(idx, file)"
						v-on:updateFields="(file) => updateFields(idx, file)"
				/>
			</div>
			<form ref="startform">
				<input type="file" ref="file" multiple @change="fileInputChanged" :accept="acceptedImageTypes" />
				<div class="drop-files">Drag new assets here</div>
			</form>
			<div v-if="newAssets.length">
				<button type="button" @click="beginUploads" class="upload-all">Upload {{newAssets.length}} File(s)</button>
			</div>
		</div>
		<div v-if="stage === 'uploading'">
			<ActiveUploadComponent
					v-for="(upload, idx) in uploads"
					:upload="upload"
					:key="idx"
			/>
		</div>
	</div>
</template>
<script lang="ts">
import Vue from "vue"
import {stopEvents} from "~/lib/file-helpers";
import NewAssetComponent from "./NewAsset.vue";
import {NewAsset} from "~/lib/assets/asset-types";
import {fieldNames} from "./AssetFields.vue";
import ActiveUploadComponent from "./ActiveUpload.vue";
import {ActiveUpload, convertNewAssetToActiveUploads} from "~/lib/assets/asset-uploads";
import {filenameGuessCategory, filenameToTitle, sleep} from "~/lib/helpers";
import {signActiveUpload, uploadAsset} from "~/lib/assets/asset-api";
import {ACCEPTED_IMAGE_TYPES} from "~/lib/assets/asset-consts";

type Stage = 'adding' | 'uploading' | 'done'

type Data = {
	stage: Stage,
	newAssets: NewAsset[],
	uploads: ActiveUpload[],
	acceptedImageTypes: string
}

export default Vue.extend({
	name: 'UploadAssets',
	props: ['assets'],
	components: {
		NewAssetComponent: NewAssetComponent,
		ActiveUploadComponent: ActiveUploadComponent,
	},
	data () : Data {
		return {
			stage: 'adding',
			newAssets: [],
			uploads: [],
			acceptedImageTypes: ACCEPTED_IMAGE_TYPES
		}
	},
	mounted () {
		const startform = this.$refs.startform as any
		stopEvents(startform)
		startform.addEventListener('drop', (e: any) => {
      for(let i = 0; i < e.dataTransfer.files.length; i++ ) {
        this.addFile(e.dataTransfer.files[i]);
      }
		})
	},
	methods: {
		// Takes all the uploads that the user has been trying to put in
		// and converts them into ActiveUploads and then it starts to
		// upload them one by one
		async beginUploads () {
			const uploads = convertNewAssetToActiveUploads(this.newAssets)
			Vue.set(this, 'uploads', uploads)
			this.stage = 'uploading'

			// Scroll to the top because they might have such a long form that it makes the
			// page quite tall, and the one at the top is going to change
			// We scroll them up so that they see the change
			window.scrollTo(0, 0)
			for (let i = 0; i < this.uploads.length; i++) {
				const upload = this.uploads[i]
				await sleep(250)
				await this.beginUpload(upload)
			}
		},

		// First you get the signature from our server, then you upload the file
		// directly to transloadit
		async beginUpload (upload: ActiveUpload) {
      await this.signUpload(upload)
      await this.uploadAsset(upload)
		},

		async signUpload (upload: ActiveUpload) {
			try {
				await signActiveUpload(upload)
			} catch (ex) {
				upload.status = 'error'
				upload.error = ex.toString()
			}
		},

		// Handles changing the 'status' of the upload, so that the UI changes
		// and calls the function that actually starts uploading the file
		async uploadAsset(upload: ActiveUpload) {
			upload.status = 'uploading'
			try {
				await uploadAsset(upload.file, upload.signature, upload.params)
				upload.status = 'complete'
			} catch (ex) {
				upload.status = 'error'
				upload.error = ex.toString()
			}
		},
		fileInputChanged (e: any) {
			e.target.files.forEach(this.addFile)
		},
		updateFile (idx: number, file: File) {
			Vue.set(this.newAssets[idx], 'file', file)
		},
		addFile (file : File) {
			const name = filenameToTitle(file.name)

			this.newAssets.push({
				asset: {
					category: filenameGuessCategory(file.name),
					description: '',
					name: name,
					tags: [],
					tagObjects: [],
					uploadAsCreator: ''
				},
				file: file,
			})
		},
		updateFields (idx: number, fields: any) {
			fieldNames.forEach((field: string) => {
				Vue.set(this.newAssets[idx].asset, field, fields[field])
			})
		}
	},
})
</script>
<style>
.upload-all {
	display: block;
	background: var(--color-primary);
	color: #fff;
	padding: 1em;
	border-radius: 10px;
	text-align: center;
	font-size: 1.5em;
	width: 100%;
	margin: 1em 0;
}
</style>
