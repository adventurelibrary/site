import Vue from "vue"
import {Component} from "nuxt-property-decorator";

// These mixins are applied to every page and component of our app
// This is where we can functions that use all the time, and we don't
// want to import and extend stuff every time
// Functions here will need to have their definitions added to the global-mixins.d.ts file
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
