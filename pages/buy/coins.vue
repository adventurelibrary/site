<template>
	<article class="just-a-regular-page">
		<h1>Purchase Coins</h1>
		<BuyCoinsForm @success="onSuccess" />
	</article>
</template>
<script lang="ts">
import {Component, Vue} from "nuxt-property-decorator";
import BuyCoinsForm from "../../modules/buy/components/BuyCoinsForm.vue";

type PurchaseOption = {
	coins: number
	price: string
	image: string
	href: string
}
@Component({
	components: {BuyCoinsForm}
})
export default class BuyCoinsPage extends Vue {
	onSuccess () {
		this.notifySuccess('Coins purchased')
	}
}
</script>
