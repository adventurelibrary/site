import Vue from "vue"
import {Component} from "nuxt-property-decorator";

@Component
class HelperMixins extends Vue {
	notifySuccess (msg: string)  {
		this.$store.dispatch('notifySuccess', msg)
	}

	notifyError (msg: string)  {
		this.$store.dispatch('notifyError', msg)
	}
}

Vue.mixin(HelperMixins)
