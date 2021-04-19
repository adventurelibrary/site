import {Asset} from "~/lib/assets/asset-types";

export type BundleFields = {
	name: string
	description: string

}
export type Bundle = BundleFields & {
	id: string
	numAssets: number
}

export type BundlesResponse = {
	bundles: Bundle[]
	total: number
}

export type BundleResponse = {
	bundle: Bundle,
	assets: Asset[]
}
