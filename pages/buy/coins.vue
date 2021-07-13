<template>
	<article>
		<h1>Purchase Coins</h1>
		<p>Support text to motivate people to buy coins.</p>
		<ul class="buy-coins-packages">
			<li v-for="(option, idx) in options" :key="idx">
				<img :src="require('~/assets/' + option.image)" alt="Coins" />
				<h4>{{option.coins}} Coins</h4>
				<p>{{option.price}}</p>
				<a class="button" :href="option.href">Buy Coins</a>
			</li>
		</ul>
	</article>
</template>
<script lang="ts">

import {Component, Vue} from "nuxt-property-decorator";
import {baseURL} from "~/lib/api";
import getCheckoutLinks from "~/modules/buy/buy-api";

type PurchaseOption = {
	coins: number
	price: string
	image: string
	href: string
}

@Component
export default class BuyCoinsPage extends Vue {
	options : PurchaseOption[] = [
		{
			coins: 500,
			price: "$5.00 USD",
			image: 'two-coins.svg',
			href: baseURL + '/buy/coins/500',
		},
		{
			coins: 1000,
			price: "$5.00 USD",
			image: 'coins.svg',
			href: baseURL + '/buy/coins/1000',
		},
		{
			coins: 2500,
			price: "$25.00 USD",
			image: 'coins-pile.svg',
			href: baseURL + '/buy/coins/2500',
		},
	]

	async mounted () {
		if (!this.$store.getters.isLoggedIn) {
			console.log('no logged in')
			return
		}

		// After the page renders, we make a request to our server to create the Checkout sessions
		// and make the Checkout links
		// Then we update the links on the page
		// This will make it faster for the user since their Checkout session is automatically
		// created before they even click the buy link, instead of right when they click it
		try {
			const linksRes = await getCheckoutLinks()
			linksRes.links.forEach((link) => {
				for (let i = 0; i < this.options.length; i++) {
					const option = this.options[i]
					if (option.coins === link.coins) {
						Vue.set(this.options[i], 'href', link.url)
						Vue.set(this.options[i], 'price', link.price)
						return
					}
				}
			})
		} catch (ex) {
			console.error(ex)
		}

	}
}
</script>
