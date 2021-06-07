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
		owner_id: '',
	}
}


export const newCreatorsAjax = () : Ajax<CreatorsResponse> => {
	return newAjax<CreatorsResponse>({
		creators: [],
		total: 0
	})
}

export async function getCreators () : Promise<CreatorsResponse> {
	const res = await api.get('/creators')
	return res.data
}

export async function getMyCreators () : Promise<CreatorsResponse> {
	const res = await api.get('/creators/mine')
	return res.data
}

export const newCreatorAjax = () : Ajax<Creator> => {
	return newAjax<Creator>(newCreator())
}

export async function getCreatorById (id: string) : Promise<Creator> {
	const res = await api.get('/creator/' + id)
	return res.data
}

export function creatorToFormData (creator: Creator) : CreatorFormData {
	console.log('owenr id', creator.owner_id)
	return {
		name: creator.name,
		owner_id: creator.owner_id,
	}
}

// Converts the data that we're using in our forms into a payload to send to the server
// This is where we could do things like parseInt
export function creatorFormDataToPayload (data: CreatorFormData) : any {
	return {
		name: data.name,
		owner_id: data.owner_id,
	}
}

export async function saveCreator (id: string, data: CreatorFormData) {
	const payload = creatorFormDataToPayload(data)
	return await api.put('/creator/' + id, payload)
}


export async function addCreator (data: CreatorFormData) : Promise<string> {
	const payload = creatorFormDataToPayload(data)
	const res = await api.post('/creators', payload)
	return res.data.id
}

