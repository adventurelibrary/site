import {Ajax, newAjax} from "~/lib/ajax";
import {Creator, CreatorFormData, CreatorsResponse} from "~/modules/creators/creator-types";
import api from "~/lib/api";

export const CREATORS = [{
	name: 'Eowyn',
	id: '4324254325'
}, {
	name: 'Galadriel',
	id: 'dfsafdsafafsd'
}]


export const newCreator = () : Creator => {
	return {
		id: '',
		name: '',
	}
}


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
				creators: CREATORS
			})
		}, 250)
	})
/*	const res = await api.get('/creators')
	return res.data*/
}

export const newCreatorAjax = () : Ajax<Creator> => {
	return newAjax<Creator>(newCreator())
}

export async function getCreatorById (id: string) : Promise<Creator> {
	console.log('id to find', id)
	const found = CREATORS.find(x => x.id === id)
	console.log('found', found)
	if (found) {
		return Promise.resolve(found)
	}
	const res = await api.get('/creators/' + id)
	return res.data
}

export function creatorToFormData (creator: Creator) : CreatorFormData {
	return {
		name: creator.name
	}
}

// Converts the data that we're using in our forms into a payload to send to the server
// This is where we could do things like parseInt
export function creatorFormDataToPayload (data: CreatorFormData) : any {
	return {
		name: data.name
	}
}

export async function saveCreator (id: string, data: CreatorFormData) {
	throw new Error('Not implemented')
	const payload = creatorFormDataToPayload(data)
	return await api.put('/creators/' + id, payload)
}
