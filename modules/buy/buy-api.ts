import {CheckoutLink, CheckoutLinksResponse} from "~/modules/buy/buy-types";
import api from "~/lib/api";

// This fetches the actual Stripe checkout links from our server for a user if they are logged in
// The URLs returned will take them directly to the checkout page for Stripe
export async function getCheckoutLinks () : Promise<CheckoutLinksResponse> {
	/*const res = await api.get('/buy/checkout-links')
	return res.data*/
	return new Promise((res) => {
		setTimeout(() => {
			res({
				links: [{
					coins: 500,
					url: 'https://checkout.stripe.com/advl?session=584329ht8t43y2t89y2894h32tg534',
					price: '$5.00 USD'
				}]
			})
		}, 250)
	})
}

export async function getCheckoutLink (amountCoins: number) : Promise<string> {
	const res = await api.post<CheckoutLink>('/coins/purchase', {
		coins: amountCoins
	})
	return res.data.url
}
