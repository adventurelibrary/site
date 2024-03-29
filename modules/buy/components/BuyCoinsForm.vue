<template>
	<form class="buy-coins-form" @submit="submit">
		<FormErrors :error="form.error" />
		<ol class="coin-purchase-options">
			<li
				v-for="(option, idx) in purchaseOptions"
				:class="{'active': idx === selectedOptionIdx}"
				:key="idx"
				@click="() => selectOption(idx)">
				<img :src="require('~/assets/' + option.image)" alt="Coins" />
				<h4>{{option.coins.toLocaleString()}} Coins</h4>
				<p>{{option.price}}</p>
			</li>
		</ol>
		<div id="stripe-card"><!-- Stripe will inject an iframe here --></div>
		<SubmitButton :submitting="form.submitting" :idle-text="submitLabel" />
	</form>
</template>
<script lang="ts">
import {Component, mixins, Prop} from "nuxt-property-decorator";
import InputGroup from "~/components/forms/InputGroup.vue";
import FormErrors from "~/components/forms/FormErrors.vue";
import SubmitButton from "~/components/forms/SubmitButton.vue";
import {COIN_PURCHASE_OPTIONS} from "../buy-consts";
import FormMixin from "~/mixins/Forms.vue";
import {ConfirmPaymentIntentResponse, confirmStripeIntent, createStripeIntent, loadStripe} from "~/lib/stripe";

@Component({
	components: {
		InputGroup: InputGroup,
		FormErrors: FormErrors,
		SubmitButton: SubmitButton
	}
})
export default class BuyCoinsForm extends mixins(FormMixin) {
	purchaseOptions = COIN_PURCHASE_OPTIONS
	selectedOptionIdx = 0
	stripeCard : any
	stripeClientSecret = ''

	@Prop({
		default: 'Buy Coins'
	}) submitLabel : string

	async formAction () {
		const purchase = COIN_PURCHASE_OPTIONS[this.selectedOptionIdx]
		const stripe = await loadStripe()
		const clientSecret = await createStripeIntent(purchase.coins)
		let stripeConfirmResult
		try {
			stripeConfirmResult = await stripe.confirmCardPayment(clientSecret, {
				payment_method: {
					card: this.stripeCard,
				}
			})
		} catch (ex) {
			console.error('Error confirming through stripe API', ex)
			throw ex
		}
		if (stripeConfirmResult.error) {
			// Show error to your customer (e.g., insufficient funds)
			console.log(stripeConfirmResult.error.message);
			this.form.error = stripeConfirmResult.error.message
		} else {
			// The payment has been processed!
			if (stripeConfirmResult.paymentIntent.status === 'succeeded') {
				const response = await this.$store.dispatch('confirmStripePayment', stripeConfirmResult.paymentIntent.id)
				console.log('confirm response', response)
				if (response.result === 'complete' || response.result === 'skipped') {
					this.$emit('success', {
						purchase: response.purchase
					})
				} else if (response.result === 'error') {
					this.form.error = 'An error occurred trying to verify your purchase'
				}
			} else {
				this.form.error = `Payment status on Stripe is "${stripeConfirmResult.paymentIntent.status}" instead of "succeeded"`
			}
		}
	}

	async mounted () {
		const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
		if (!stripePublicKey) {
			throw new Error(`No Stripe public key found. Check for STRIPE_PUBLIC_KEY in your .env file`)
		}
		const stripe = await loadStripe()
		const elements = stripe.elements();

		// The Stripe elements are iframes, so we have to pass styles this way
		const cardStyle = {
			base: {
				color: "#808080",
				fontFamily: 'Arial, sans-serif',
				fontSize: '20px',
				fontSmoothing: "antialiased",
				"::placeholder": {
					color: "#606060"
				}
			},
			invalid: {
				fontFamily: 'Arial, sans-serif',
				color: "#fa755a",
				iconColor: "#fa755a"
			}
		};

		this.stripeCard = elements.create('card', {
			style: cardStyle
		})
		this.stripeCard.mount('#stripe-card')

		this.stripeCard.on('change', ({error}) => {
			console.log('error', error)
			if (error) {
				this.form.error = error.message
			} else {
				this.form.error = ''
			}
		});
	}

	selectOption (idx: number) {
		this.selectedOptionIdx = idx
	}
}
</script>
