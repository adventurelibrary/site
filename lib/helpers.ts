import {CATEGORIES} from "~/lib/categories/categories-consts";

export interface SelectOption {
	value: any,
	label: string
}

export const sleep = (ms : number = 500) => {
	return new Promise(resolve => setTimeout(resolve, ms))
}

export function objectToQueryString (obj : Record<string, any>) {
	var str = [];
	for (var p in obj) {
			str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	}
	return str.join("&");
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

function titleCase (str: string) : string {
	return str.toUpperCase().substr(0, 1) + str.toLowerCase().substr(1)
}

function isKebabOrTitleCase (str: string) : boolean {
	return str.indexOf(' ') == -1
		&& str.toLowerCase() != str
		&& str.toUpperCase() != str
		&& str.indexOf('-') == -1
		&& str.indexOf('_') == -1
}

export function stringToFakeId (str: string) : string {
	return str.repeat(2).toLowerCase().split(/\s/).join('')
}

export function filenameGuessCategory(filename: string) : string {
	const lower = filename.toLowerCase()
	for(let i = 0; i < CATEGORIES.length; i++) {
		const at = CATEGORIES[i]
		if (lower.indexOf(at.id) >= 0) {
			return at.id
		}
	}

	return ''
}

export function filenameToTitle(filename: string) : string {
	const parts = filename.split('.')
	parts.pop() // Remove file extension

	let words: string[] = []
	let basename = parts.join('.')
	if (isKebabOrTitleCase(basename)) {
		words = basename.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');
	} else {
		let title = parts.join('_') // Rejoin in case they had multiple .'s in the filename
		words = title.split(/[-_]/)
	}

	const smallwords = ['of', 'the', 'in', 'a']
	const title = words.map((word, idx) => {
		if (idx == 0) {
			return titleCase(word)
		}
		if (smallwords.indexOf(word) >= 0) {
			return word.toLowerCase()
		}

		return titleCase(word)
	}).join(' ')

	return title
}

export function getElOffset (el: Element) {
	var rect = el.getBoundingClientRect(),
		scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
		scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	return {
		top: rect.top + scrollTop,
		left: rect.left + scrollLeft
	}
}

export function setCookie (cname: string, cvalue: any, exdays : number = 7) {
	const d = new Date();

	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	const expires = "expires="+ d.toUTCString();

	const cookie = cname.trim() + "=" + cvalue + "; " + expires;
	document.cookie = cookie;
}

export function getCookie (cname: string) {
	const name = cname + "=";
	const ca = document.cookie.split(';');
	for(let i = 0; i <ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0)==' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length,c.length);
		}
	}
	return "";
}
