<template>
	<div>
		<div>
			<div>
				<h2>Upload Artwork</h2>
				<p v-if="creator"><em>Uploading as {{creator.name}}</em></p>
				<p>File should be jpg, png, or svg.</p>
			</div>
			<div>
				<label for="add-file" class="btn btn-add-file">+ Add File</label>
				<button type="button" :disabled="newAssets.length == 0" @click="beginUploads" class="upload-all">Submit All</button>
			</div>
		</div>
		<FormErrors :error="error" />
		<div v-show="stage === 'adding'">
			<div v-if="asAdmin">
				<div>Upload as creator <span v-if="creator">{{creator.name}}</span><span v-else>n/a</span></div>
				<CreatorSelector v-model="creator" />
			</div>
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
				<input id="add-file" class="file" type="file" ref="file" multiple @change="fileInputChanged" :accept="acceptedImageTypes" />
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
import CreatorSelector from "~/modules/creators/components/CreatorSelector.vue";
import {Creator} from "~/modules/creators/creator-types";
import FormErrors from "~/components/forms/FormErrors.vue";
import {convertAPIException} from "~/lib/errors/errors";

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
		CreatorSelector: CreatorSelector
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

			this.newAssets.push({
				asset: {
					tags: [],
					tagObjects: [],
					description: '',
					name: name,
          visibility: 'PENDING',
					category: filenameGuessCategory(file.name),
					creator_id: this.getCreatorId()
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
