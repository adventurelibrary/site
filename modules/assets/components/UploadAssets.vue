<template>
	<fragment>
		<section class="upload-header">
			<h2>Upload Artwork</h2>
			<p v-if="creator"><em>Uploading as {{creator.name}}</em></p>
			<p>File should be jpg, png, or svg.</p>
		</section>
		<section class="upload-controls">
			<label class="button add-file basic" for="add-file">+Add Upload</label>
			<button type="button" :disabled="newAssets.length === 0" @click="beginUploads" class="upload-all">Submit All</button>
		</section>
		<section v-show="stage === 'adding'" class="upload-form">
			<FormErrors :error="error" class="upload-errors" />
			<div v-if="asAdmin">
				<div>Upload as creator</div>
				<CreatorSelector v-model="creator" />
			</div>
			<form ref="startform" class="startform">
				<div class="drop-files start">
					<label for="add-file">Drag &amp; drop new files here</label>
					<input id="add-file" class="file" type="file" ref="file" multiple @change="fileInputChanged" :accept="acceptedImageTypes" />
				</div>
			</form>
			<ul v-show="newAssets.length !== 0" class="upload-list">
				<NewAssetComponent
					v-for="(asset, idx) in newAssets"
					:new-asset="asset"
					:key="idx"
					v-on:addFile="addFile"
					v-on:updateFile="(file) => updateFile(idx, file)"
					v-on:updateFields="(file) => updateFields(idx, file)"
				/>
			</ul>
			<div v-show="newAssets.length">
				<button type="button" @click="beginUploads" class="upload-all">Upload {{numFiles}}</button>
			</div>
		</section>
		<section v-show="stage === 'uploading'" class="upload-status">
			<ActiveUploadComponent
				v-for="(upload, idx) in uploads"
				:upload="upload"
				:key="idx"
			/>
		</section>
	</fragment>
</template>
<script lang="ts">
import Vue from "vue"
import {stopEvents} from "~/lib/file-helpers";
import NewAssetComponent from "./NewAsset.vue";
import {NewAsset} from "~/modules/assets/asset-types";
import {fieldNames} from "./AssetFields.vue";
import ActiveUploadComponent from "./ActiveUpload.vue";
import {ActiveUpload, convertNewAssetToActiveUploads} from "~/modules/assets/asset-uploads";
import {filenameGuessCategory, filenameToTitle, sleep} from "~/lib/helpers";
import {signActiveUpload, uploadAsset} from "~/modules/assets/asset-api";
import {ACCEPTED_IMAGE_TYPES} from "~/modules/assets/asset-consts";
import CreatorSelector from "~/modules/creators/components/CreatorSelector.vue";
import FormErrors from "~/components/forms/FormErrors.vue";
import {convertAPIException} from "~/lib/errors/errors";
import {Fragment} from "vue-fragment";

type Stage = 'adding' | 'uploading' | 'done'

type Data = {
	stage: Stage,
	newAssets: NewAsset[],
	uploads: ActiveUpload[],
	acceptedImageTypes: string,
	error: string,
}

export default Vue.extend({
	name: 'UploadAssets',
	props: ['assets', 'asAdmin', 'creator'],
	components: {
		FormErrors,
		NewAssetComponent: NewAssetComponent,
		ActiveUploadComponent: ActiveUploadComponent,
		CreatorSelector: CreatorSelector,
		Fragment
	},
	data () : Data {
		return {
			stage: 'adding',
			newAssets: [],
			error: '',
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
	computed: {
		numFiles ()  : string {
			return `${this.newAssets.length} File${this.newAssets.length == 1 ? '' : 's'}`
		}
	},
	methods: {
		async beginUploads () {
			if (this.asAdmin) {
				if (!this.creator) {
					this.error = 'Please select a creator'
					this.notifyError('Please select a creator')
					return
				}
			}
			try {
				const uploads = convertNewAssetToActiveUploads(this.newAssets, this.getCreatorId())
				Vue.set(this, 'uploads', uploads)
				this.stage = 'uploading'
				window.scrollTo(0, 0)
				for (let i = 0; i < this.uploads.length; i++) {
					const upload = this.uploads[i]
					await sleep(250)
					await this.beginUpload(upload)
				}
			} catch (ex) {
				this.error = convertAPIException(ex)
				this.stage = 'adding'
			}
		},

		async beginUpload (upload: ActiveUpload) {
      await this.signUpload(upload)
      await this.uploadAsset(upload)
		},

		async signUpload (upload: ActiveUpload) {
			await signActiveUpload(upload)
		},

		async uploadAsset(upload: ActiveUpload) {
			upload.status = 'uploading'
			upload.error = ''
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

			this.newAssets.unshift({
				asset: {
					tags: [],
					tagObjects: [],
					description: '',
					name: name,
					creator_id: this.getCreatorId(),
          visibility: 'HIDDEN',
					category: filenameGuessCategory(file.name),
				},
				file: file,
			})
		},
		updateFields (idx: number, fields: any) {
			fieldNames.forEach((field: string) => {
				Vue.set(this.newAssets[idx].asset, field, fields[field])
			})
		},
		getCreatorId () : string {
			if (!this.creator) {
				return ''
			}
			return this.creator.id
		}
	},
})
</script>
<style>
</style>
