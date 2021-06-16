import {Asset} from "~/modules/assets/asset-types";

// These are the fields of a bundle that exist both in our data
// and in our forms. This includes forms for creating a bundle
// that does not yet exist in our db
export type BundleFields = {
	name: string
	description: string
	public: boolean

}

// A bundle from our database (or elasticsearch)
export type Bundle = BundleFields & {
	id: string
	numAssets: number
	slug: string
	assets?: Asset[]
}

export type BundlesResponse = {
	bundles: Bundle[]
	total: number
}

export type BundleResponse = undefined | Bundle
