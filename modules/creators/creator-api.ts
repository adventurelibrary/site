import api from "~/lib/api";
import {CreatorsResponse} from "~/modules/creators/creator-types";

export async function getCreators () : Promise<CreatorsResponse> {
	return new Promise((res) => {
		setTimeout(() => {
			res({
				creators: [{
					id: '12343214231',
					name: 'Adventure Library'
				}, {
					id: '543gfds32y423y',
					name: 'Demo Creator'
				}],
				total: 2
			})
		}, 257)
	})
	/*
	// When the backend has this, use this
	const res = api.get<CreatorsResponse>('/creators')
	return res.data*/
}
