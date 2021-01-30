import {setBaseURL} from "adventurelibrary/dist/api";

export default function () {
	console.log('doin it to', process.env.ADVL_BASE_URL)
	setBaseURL(<string>process.env.ADVL_BASE_URL)
}
