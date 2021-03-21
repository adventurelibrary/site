export type Ajax<T> = {
	data?: T
	error: string
	loading: boolean
}

export interface AjaxList {
	results: any[]
	total: number
}

export const newAjax= <T>(data: T) : Ajax<T> =>{
	return {
		error: '',
		loading: false,
		data: data
	}
}

export const getAjaxData = <T>(ajax: Ajax<T>) : T | null => {
	if (ajax.loading || ajax.error || !ajax.data) {
		return null
	}

	return ajax.data
}

// Performs an async and updates the obj passed in as it goes
export const doAjax = async <T>(obj: Ajax<T>, fn: () => Promise<T>, skipLoading = false) => {
	obj.loading = !skipLoading
	obj.error = ''
	obj.data = undefined
	try {
		obj.data = await fn()
	} catch (ex) {
		obj.error = ex.toString()
	}
	obj.loading = false
	return obj
}


// This helper is used in components to create an easy-to-use array variable for the template
// This is so you can do <strong>There are {{items.length}} items</strong>
// if items is coming from an ajax request that might be loading or have errors
export const computeAjaxList = (ajax: any) : any[] => {
	if (ajax.loading || ajax.error) {
		return []
	}
	if (!ajax.data || !ajax.data.results) {
		return []
	}
	return ajax.data.results
}
