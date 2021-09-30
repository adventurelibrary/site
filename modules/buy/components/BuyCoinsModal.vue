<template>
	<Modal
		:show="true"
		class-name="buy-coins-modal"
		title="Buy Coins"
		@close="closeModal">
		<slot>
			<div class="buy-unlock-msg" v-if="asset">
				<div class="asset-thumbnail-container">
					<AssetThumbnail :asset="asset" />
				</div>
				<div class="msg">
					<span>
						<small v-if="unlocking">Unlocking</small>
						<small v-else>Buy coins to unlock</small>
						<br /><strong>{{asset.name}}</strong> by <strong>{{asset.creator_name}}</strong> for {{asset.unlock_price}} coins</span>
				</div>
			</div>
			<template v-if="!unlocking">
				<BuyCoinsForm @success="onSuccess" submit-label="Buy Coins & Unlock" />
			</template>
		</slot>
	</Modal>
</template>
<script lang="ts">
import Vue from "vue";
import {Component, Prop, State} from "nuxt-property-decorator";
import Modal from "~/modules/modals/Modal.vue";
import BuyCoinsForm from "./BuyCoinsForm.vue";
import AssetThumbnail from "../../assets/components/AssetThumbnail.vue";
import {CoinPurchase} from "../buy-types";
import {ConfirmPaymentIntentResponse} from "../../../lib/stripe";

@Component({
	components: {
		AssetThumbnail,
		BuyCoinsForm,
		Modal: Modal,
	}
})
export default class BuyCoinsModal extends Vue {
	unlocking = false
	@Prop() show : boolean
	@State('buyUnlockAsset') asset

	mounted () {
		console.log('buy coins modal')
	}

	closeModal () {
		this.$store.dispatch('closeAllModals')
	}

	async onSuccess ({purchase} : ConfirmPaymentIntentResponse) {
		this.notifySuccess(`Bought ${purchase.coins} coins`)
		if (this.asset) {
			this.unlocking = true
			try {
				await this.$store.dispatch('unlockAsset', {
					asset:this.asset
				})
			} catch (ex) {
				this.notifyError(`Error unlocking asset: ${ex.toString()}`)
			}
			this.unlocking = false
		}
		this.$store.dispatch('closeAllModals')
	}
}
</script>
