export type BundleFields = {
	name: string
	description: string

}
export type Bundle = BundleFields & {
	id: string
	numAssets: number
}

// This is the data our form works with
// It is converted before being sent to our API
export type BundleFormData = BundleFields & {
	assetId: string | null
}

export type BundlesResponse = {
	bundles: Bundle[]
	total: number
}
