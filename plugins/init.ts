import {setBaseURL} from "~/lib/api";

export default function () {
	setBaseURL(<string>process.env.ADVL_BASE_URL)
}
