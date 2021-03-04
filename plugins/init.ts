import {setBaseURL} from "adventurelibrary/dist/api";

export default function () {
	setBaseURL(<string>process.env.ADVL_BASE_URL)
}
