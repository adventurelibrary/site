import {baseURL} from "../../lib/api";

export const COIN_PURCHASE_OPTIONS = [
	{
		coins: 500,
		price: "$5.00 USD",
		image: 'two-coins.svg',
		href: baseURL + '/buy/coins/500',
	},
	{
		coins: 1000,
		price: "$10.00 USD",
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
