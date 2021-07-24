<template>
	<div class="asset-action asset-download">
		<template v-if="canDownload">
			<select v-model="fileType" class="download-format">
				<option v-for="option in fileOptions" :key="option.value" :value="option.value">{{option.label}}</option>
			</select>
			<a class="button" @click="download">
				<i class="ci-download"></i>
			</a>
		</template>
		<template v-if="mustUnlock">
			<span @click="clickUnlockAsset">Unlock</span>
		</template>
	</div>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Prop} from "nuxt-property-decorator";
import {Asset, AssetDownloadOptions} from "~/modules/assets/asset-types";
import {SelectOption} from "~/lib/helpers";
import {getAssetDownloadLink} from "~/modules/assets/asset-api";

@Component
export default class AssetDownload extends Vue {
	fileOptions : SelectOption[] = [
		{value: 'webp', label: 'WebP'},
		{value: 'original', label: 'Original'}
	]
	fileType = 'original'

	@Prop() asset : Asset

	get canDownload () : boolean {
		return this.asset.is_unlocked
	}
	get mustUnlock () : boolean {
		return !this.asset.is_unlocked
	}

	async download (e: Event) {
		e.preventDefault()
		try {
			const url = await getAssetDownloadLink(this.asset.id, this.getDownloadOptions())
			window.open(url, '_blank')
		} catch (ex) {
			console.log('ex', ex)
			this.notifyError('Error downloading asset: ' + ex.toString())
		}
	}

	async clickUnlockAsset () {
		try {
			await this.$store.dispatch('unlockAsset', {
				asset: this.asset
			})
		} catch (ex) {
			this.notifyError(ex.toString())
			return
		}
		this.notifySuccess(`Unlocked ${this.asset.name}`)
		this.asset.is_unlocked = true
	}

	getDownloadOptions () : AssetDownloadOptions {
		return {
			file: this.fileType
		}
	}
}
</script>
