import api from "./api";

import {loadStripe as loadStripeA} from '@stripe/stripe-js';

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


export async function confirmStripeIntent (paymentIntentId: string) : Promise<{coins: number}>{
	const res = await api.post('coins/purchase/stripe-intent-confirm', {
		paymentIntentId
	})
	console.log('res data', res.data)
	return res.data
}
