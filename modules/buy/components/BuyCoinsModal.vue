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
					<span><small>Buy coins to unlock</small><br /><strong>{{asset.name}}</strong> by <strong>{{asset.creator_name}}</strong></span>
				</div>
			</div>
			<BuyCoinsForm @success="onSuccess" submit-label="Buy Coins & Unlock" />
		</slot>
	</Modal>
</template>
<script lang="ts">
import Vue from "vue";
import {Component, Prop, State} from "nuxt-property-decorator";
import Modal from "~/modules/modals/Modal.vue";
import BuyCoinsForm from "./BuyCoinsForm.vue";
import AssetThumbnail from "../../assets/components/AssetThumbnail.vue";

@Component({
	components: {
		AssetThumbnail,
		BuyCoinsForm,
		Modal: Modal,
	}
})
export default class BuyCoinsModal extends Vue {
	@Prop() show : boolean
	@State('buyUnlockAsset') asset

	mounted () {
		console.log('buy coins modal')
	}

	closeModal () {
		this.$store.dispatch('closeAllModals')
	}

	onSuccess () {
		this.$store.dispatch('closeAllModals')
	}
}
</script>
