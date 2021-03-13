<template>
	<div>
		<div v-show="stage === 'adding'">
			<div v-show="newAssets.length !== 0">
				Here are your files
				<NewAssetComponent
						v-for="(asset, idx) in newAssets"
						:asset="asset"
						:key="idx"
						v-on:addFile="addFile"
						v-on:updateFile="(file) => updateFile(idx, file)"
						v-on:updateFields="(file) => updateFields(idx, file)"
				/>
			</div>
			<form ref="startform">
				<input type="file" multiple @change="fileInputChanged" accept="image/png, image/jpg, image/jpeg" />
				<div class="drop-files" style="border: 1px solid #ccc; padding: 5em; text-align: center;">Drag new assets here</div>
			</form>
			<div v-if="newAssets.length">
				<button type="button" @click="beginUploads">Upload {{newAssets.length}} File(s)</button>
			</div>
		</div>
		<div v-if="stage === 'uploading'">
			<ActiveUploadComponent
					v-for="(upload, idx) in uploads"
					:upload="upload"
					:key="idx"
			/>
			<div v-for="(upload, idx) in uploads" :key="idx+10">{{idx}}/{{upload.status}}/{{upload.signature}}</div>
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
import {sleep} from "~/lib/helpers";

type Stage = 'adding' | 'uploading' | 'done'

type Data = {
	stage: Stage,
	newAssets: NewAsset[],
	uploads: ActiveUpload[]
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
			uploads: []
		}
	},
	mounted () {
		const startform = this.$refs.startform as any
		stopEvents(startform)
		startform.addEventListener('drop', (e: any) => {
      for( let i = 0; i < e.dataTransfer.files.length; i++ ){
        this.addFile( e.dataTransfer.files[i] );
      }
		})
	},
	methods: {
		async beginUploads () {
			const uploads = convertNewAssetToActiveUploads(this.newAssets)
			Vue.set(this, 'uploads', uploads)
			this.stage = 'uploading'
			for (let i = 0; i < this.uploads.length; i++) {
				const upload = this.uploads[i]
				await sleep(250)
				await this.beginUpload(upload)
			}
		},

		async beginUpload (upload: ActiveUpload) {
      await this.signUpload(upload)
      await this.uploadFile(upload)
		},

		async  signUpload (upload: ActiveUpload) {
			upload.signature = btoa(upload.title + new Date().getTime().toString())
			upload.status = 'signed'
			await sleep(500)
		},

		async  uploadFile(upload: ActiveUpload) {
			upload.status = 'uploading'
			try {
				for (let i = 0; i <= 100; i++) {
					upload.progress = i
					await sleep(25)
				}
				console.log('done the loop')
				upload.status = 'complete'
			} catch (ex) {
				console.log('coatched errr', ex)
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
			const parts = file.name.split('.')
			parts.pop() // Remove file extension
			let title = parts.join(' ')
			title = title.split(/[-_]/).join(' ')

			this.newAssets.push({
				asset: {
					description: '',
					title: title,
					type: 'map',
					tags: []
				},
				file: file,
			})
		},
		updateFields (idx: number, fields: any) {
			fieldNames.forEach((field: string) => {
				Vue.set(this.newAssets[idx], field, fields[field])
			})
		}
	},
})
</script>