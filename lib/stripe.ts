import api from "./api";

import {loadStripe as loadStripeA} from '@stripe/stripe-js';
import {CoinPurchase} from "../modules/buy/buy-types";

let stripe
export const loadStripe = async () => {
	if (stripe) {
		return stripe
	}
	stripe = await loadStripeA(process.env.STRIPE_PUBLIC_KEY)
	return stripe
}

export async function createStripeIntent (coins: number) : Promise<string> {
	const res = await api.post('coins/purchase/stripe-intent', {
		coins
	})

	return res.data.client_secret
}

// Skipped means that this payment intent has already been successfully completed
// and the coins given to the user
type CheckPaymentIntentResult = 'skipped' | 'complete' | 'error'

export type ConfirmPaymentIntentResponse = {
	coins: number // How many coins the user now has
	purchase: CoinPurchase,
	result: CheckPaymentIntentResult // The result of checking this payment intent
}
export async function confirmStripeIntent (paymentIntentId: string) : Promise<ConfirmPaymentIntentResponse>{
	const res = await api.post('coins/purchase/stripe-intent-confirm', {
		paymentIntentId
	})
	console.log('res data', res.data)
	return res.data
}
