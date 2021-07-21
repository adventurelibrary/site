export type CheckoutLink = {
	url: string // The Stripe checkout URL
	price: string // To display to user
	coins: number //How many they gon' get
}

export type CheckoutLinksResponse = {
	links: CheckoutLink[]
}
