import Vue from "vue"
import {Component} from "nuxt-property-decorator";

@Component
export default class AdminPage extends Vue {
	layout () {
		return 'admin'
	}
}
