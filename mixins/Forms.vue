<script lang="ts">
import FormErrors from "~/components/forms/FormErrors.vue";
import Vue from "vue"
import {Component} from "nuxt-property-decorator";

export type Form = {
	data: any,
	error: string,
	submitting: boolean
}

export const newForm = (data = {}) : Form => {
	return {
		data: data,
		error: '',
		submitting: false
	}
}

@Component({
	components: {
		FormErrors: FormErrors
	}
})
export default class FormMixin extends Vue {
	public form = newForm()
	public formSuccessMessage = ''
	validateForm () : string {
		return ''
	}

	// This should be overwritten by any component
	// that implements this mixin
	async formAction () {
		throw new Error('Form action needs to be implemented by the inheriting component')
	}

	async formSuccess () {
		if (!this.formSuccessMessage) {
			return
		}
		this.notifySuccess(this.formSuccessMessage)
	}

	async submit (e: any) {
		e.preventDefault()
		const err = this.validateForm()
		if (err && err.length) {
			this.form.error = err
			this.form.submitting = false
			console.log('error', err)
			return
		}
		this.form.submitting = true
		this.form.error = ''
		try {
			await this.formAction()
			this.form.submitting = false
			await this.formSuccess()
		} catch (ex) {
			this.form.error = ex.toString()
			this.form.submitting = false
			//this.notifyError('Error submitting form:' + ex.toString())
		}
	}
}
</script>
