import {Ajax, newAjax} from "~/lib/ajax";
import {CreatorsResponse} from "~/lib/creators/creator-types";
import api from "~/lib/api";

export const newCreatorsAjax = () : Ajax<CreatorsResponse> => {
	return newAjax<CreatorsResponse>({
		creators: [],
		total: 0
	})
}

export async function getCreators () : Promise<CreatorsResponse> {
	return new Promise((res) => {
		setTimeout(() => {
			res({
				total: 2,
				creators: [{
					name: 'Eowyn',
					id: '4324254325'
				}, {
					name: 'Galadriel',
					id: 'dfsafdsafafsd'
				}]
			})
		}, 250)
	})
/*	const res = await api.get('/creators')
	return res.data*/
}
