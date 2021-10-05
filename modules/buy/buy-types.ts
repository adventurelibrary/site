export type CheckoutLink = {
	url: string // The Stripe checkout URL
	price?: string // To display to user
	coins?: number //How many they gon' get
}

export type CheckoutLinksResponse = {
	links: CheckoutLink[]
}

type CoinPurchaseStatus = 'pending' | 'complete' | 'error'

export type CoinPurchase = {
	id: number
	created_date: Date
	succeeded_date: Date
	cents: number
	provider: string
	coins: number
	status: CoinPurchaseStatus

}
export type CoinPurchasesResponse =  {
	total: number
	results: CoinPurchase[]
}
