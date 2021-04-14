import {BundlesResponse} from "~/lib/bundles/bundle-types";

export async function getMyBundles () : Promise<BundlesResponse> {
	return new Promise((res) => {
		setTimeout(() => {
			res({
				bundles: [{
					id: 'kfsdlasfdasfdsafa',
					name: 'Dark Heresy Campaign',
					description: '',
					numAssets: 2
				}, {
					id: '34dagdsagdsag',
					name: 'Forest Maps',
					description: '',
					numAssets: 3
				}],
				total: 1,
			})
		}, 500)
	})
}
