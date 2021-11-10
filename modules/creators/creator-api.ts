import {Ajax, newAjax} from "~/lib/ajax";
import {Creator, CreatorFormData, CreatorsResponse, ManageCreatorAssets} from "~/modules/creators/creator-types";
import api from "~/lib/api";
import {AssetSearchOptions} from "~/modules/assets/asset-types";
import {assetSearchOptionsToAPIQuery} from "~/modules/assets/asset-api";

export const newCreator = () : Creator => {
	return {
		id: '',
		name: '',
		slug: '',
	}
}


export const newCreatorsAjax = () : Ajax<CreatorsResponse> => {
	return newAjax<CreatorsResponse>({
		creators: [],
		total: 0
	})
}

/**
 * Returns all creators. This is for public users to get creators, like in the
 * the search bar
 */
export async function getCreators () : Promise<CreatorsResponse> {
	const res = await api.get('/creators')
	return res.data
}

/**
 * This loads the full list of creators for our backend once, then stores it in memory
 * So that we only make the request once per session. Refreshing the page will make
 * this request again
 * This function was made for the SearchBar, so that we can lazy load our list of
 * creators, and only load them once
 */
let creatorsCache : null | Creator[] = null
export async function getCreatorsCached () : Promise<Creator[]> {
	if (creatorsCache !== null) {
		return creatorsCache
	}
	const res = await getCreators()
	creatorsCache = res.creators
	return creatorsCache
}



export async function getMyCreators () : Promise<CreatorsResponse> {
	const res = await api.get('/manage/creators')
	return res.data
}

export const newCreatorAjax = () : Ajax<Creator> => {
	return newAjax<Creator>(newCreator())
}

// This is used in the management area, where the route params use the creator's ID
export async function getManageCreatorById (id: string) : Promise<Creator> {
	const res = await api.get('/manage/creator/' + id)
	return res.data
}

// Returns the assets from a specific creator that you have access to view
// This is for the management pages, not for public viewing
export const getManageCreatorAssets = async (creatorId: string, search: AssetSearchOptions) : Promise<ManageCreatorAssets> => {
	const searchQuery = assetSearchOptionsToAPIQuery(search)
	const res = await api.get(`/manage/creator/${creatorId}/assets`, {
		params: searchQuery
	})
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
	const payload = creatorFormDataToPayload(data)
	return await api.put('/manage/creator/' + id, payload)
}


export async function addCreator (data: CreatorFormData) : Promise<string> {
	const payload = creatorFormDataToPayload(data)
	const res = await api.post('/manage/creators', payload)
	return res.data.id
}

