<template>
	<div class="asset-download">
		<div v-if="canDownload">
			<select v-model="fileType">
				<option v-for="option in fileOptions" :key="option.value" :value="option.value">{{option.label}}</option>
			</select>
			<a @click="download">Download</a>
		</div>
		<div v-if="mustUnlock">
			Unlock for {{asset.cost}}
		</div>
	</div>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Prop} from "nuxt-property-decorator";
import {Asset, AssetDownloadOptions} from "~/lib/assets/asset-types";
import {SelectOption} from "~/lib/helpers";
import {getAssetDownloadLink} from "~/lib/assets/asset-api";

@Component
export default class AssetDownload extends Vue {
	fileOptions : SelectOption[] = [
		{value: 'webp', label: 'WebP'},
		{value: 'original', label: 'Original'}
	]
	fileType = 'original'

	@Prop() asset : Asset

	// These will later be based on the user in the VueX store
	get canDownload () : boolean {
		return true
	}
	get mustUnlock () : boolean {
		return false
	}

	async download (e: Event) {
		e.preventDefault()
		try {
			const res = await getAssetDownloadLink(this.asset.id, this.getDownloadOptions())
			window.open(res.url, '_blank')
		} catch (ex) {
			this.notifyError('Error downloading asset: ' + ex.toString())
		}
	}

	getDownloadOptions () : AssetDownloadOptions {
		return {
			file: this.fileType
		}
	}
}
</script>