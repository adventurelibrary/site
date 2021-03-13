export interface SelectOption {
	value: any,
	label: string
}

export const sleep = (ms : number = 500) => {
	return new Promise(resolve => setTimeout(resolve, ms))
}

export function keyBoolToArray (checked : Record<string, boolean>) : string[] {
	if (!checked) {
		return []
	}
	const vals : string[] = []
	Object.keys(checked).forEach((key : string) => {
		if (checked[key]) {
			vals.push(key)
		}
	})

	return vals
}

// For checklist
export function arrayToKeyBool (keys : any[]) : Record<string, boolean> {
	if (!keys) {
		return {}
	}
	const vals : Record<string, boolean> = {}
	keys.forEach((key: string) => {
		vals[key] = true
	})
	return vals
}

// ["blue", "red", "green"] => blue, red, and green
export function commaAndJoin (pieces: string[]) : string {
	if (pieces.length <= 2) {
		return pieces.join(' and ')
	}

	let last = pieces.pop()

	return pieces.join(', ') + ', and ' + last
}
