<template>
	<div class="asset-download">
		<template v-if="canDownload">
			<select v-model="fileType" class="download-format">
				<option v-for="option in fileOptions" :key="option.value" :value="option.value">{{option.label}}</option>
			</select>
			<a class="button" @click="download">
				<i class="ci-download"></i>
			</a>
		</template>
		<template v-if="mustUnlock">
			<button @click="clickUnlockAsset" @mousedown="stopPropagation">
				<span class="icon material-icons"></span>
				<span class="amount">{{asset.unlock_price}}</span>
			</button>
			<!--<span @click="clickUnlockAsset" class='asset-unlock'>{{price}} Unlock</span>-->
		</template>
	</div>
</template>
<script lang="ts">
import {Component, mixins, Prop} from "nuxt-property-decorator";
import {Asset, AssetDownloadOptions} from "~/modules/assets/asset-types";
import {SelectOption} from "~/lib/helpers";
import {getAssetDownloadLink} from "~/modules/assets/asset-api";
import StopPropagation from "~/mixins/StopPropagation.vue";

@Component
export default class AssetDownload extends mixins(StopPropagation) {
	fileOptions : SelectOption[] = [
		{value: 'webp', label: 'WebP'},
		{value: 'original', label: 'Original'}
	]
	fileType = 'original'

	@Prop() asset : Asset


	get canDownload () : boolean {
		return this.asset.unlocked
	}
	get mustUnlock () : boolean {
		return !this.asset.unlocked
	}

	get price () : string {
		if (this.asset.unlock_price == 0 || !this.asset.unlock_price) {
			return "FREE "
		}
		else {
			return this.asset.unlock_price.toString() + ' coins '
		}
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
		let result

		try {
			result = await this.$store.dispatch('unlockAsset', {
				asset: this.asset
			})
		} catch (ex) {
			this.notifyError(ex.toString())
			return
		}

		if (result === 'needscoins') {
			this.notifyError(`You need more coins (${this.asset.unlock_price} coins) to unlock '${this.asset.name}'. Redirecting you to the coins purchase page.`)
			this.asset.unlocked = false
			this.$router.push('/buy/coins')
		}
		if (result === 'unlocked') {
			this.asset.unlocked = true

			// This isn't working correctly, but that might be a setting problem in Google?
			// However, I'm not sure we even want this here? Or do we just want to track purchases of coins?
			this.$gtag.purchase({
				'transaction_id': "",
				'items': [{
					'id': this.asset.id,
					'name': this.asset.name,
					'brand': this.asset.creator_name,
					'category': this.asset.category,
				}]
			});
		}
	}

	getDownloadOptions () : AssetDownloadOptions {
		return {
			file: this.fileType
		}
	}
}
</script>
