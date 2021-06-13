import {Asset} from "~/modules/assets/asset-types";

export type BundleFields = {
	name: string
	description: string
	public: boolean

}
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
