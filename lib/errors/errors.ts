export function convertAPIException (ex: any) : string {
	console.log(JSON.stringify(ex))
	if (typeof ex === 'object') {
		if (ex.key === 'validation') {
			return ex.details.map((detail: any) => {
				return detail.message
			}).join(' & ')
		}
	}
	return ex.toString()
}
