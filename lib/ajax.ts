// What is an "Ajax"?
// This is an object meant to contain the three main components of an ajax component or page. It is meant to answer
// three main questions:
// - Is the data currently being fetched from the server?
// - Were there are any errors fetching the data?
// - What is the data?
// The type of data will vary depending on each implementation, so you can pass Ajax your own type which will replace T
// eg const aj = Ajax<BundlesResponse>{...

export type Ajax<T> = {
	data?: T
	error: string
	loading: boolean
}

export const newAjax= <T>(data: T) : Ajax<T> =>{
	return {
		error: '',
		loading: false,
		data: data
	}
}

// This helper returns the data of an Ajax, provided that it isn't still loading, and that there aren't any errors
export const getAjaxData = <T>(ajax: Ajax<T>) : T | undefined => {
	if (ajax.loading || ajax.error || !ajax.data) {
		return undefined
	}

	return ajax.data
}

// Performs an async and updates the obj passed in as it goes
// This function can be used in client side requests to make a request to the server for more data, and have this
// function handle toggling the "loading" state, as well as the "error" (if needed)
// A good example of where this might be used is when a user clicks the pagination links on a page, and the ?page=X
// value changes. You could then call something like `await doAjax<BundlesResponse>(this.bundlesAjax, this.getBundles)`
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
export const computeAjaxList = (ajax: any, field = 'results') : any[] => {
	if (ajax.loading || ajax.error) {
		return []
	}
	if (!ajax.data || !ajax.data[field]) {
		return []
	}
	return ajax.data[field]
}

// This helper is similar to the one above, it is typically used as `get` function on a Vue
// component so that the template has a number it can render for the total results on that page
// This would be used to show "There are 325 total assets" on an asset search
export function computeAjaxTotal (ajax : undefined | hasDataWithTotal) : number {
	if (!ajax || !ajax.data) {
		return 0
	}
	return ajax.data.total || 0
}

interface hasDataWithTotal {
	data?: hasTotal
}

interface hasTotal  {
	total: number
}
