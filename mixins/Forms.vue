<script lang="ts">
import FormErrors from "~/components/forms/FormErrors.vue";
import Vue from "vue"

export const newForm = (data = {}) => {
	return {
		data: data,
		error: '',
		submitting: true
	}
}

export const FormMixin = Vue.extend({
	components: {
		FormErrors: FormErrors
	},
	data () {
		return {
			form: newForm()
		}
	},
	methods: {
		success () {
			// do a success thing
		},
		validate () : string {
			// do some validation
			return ''
		},
		/*async submit(e: any) {
			if (e) {
				e.preventDefault()
			}
			if (this.validate) {
				const error = this.validate()
				if (error) {
					this.form.error = error
				}
				return
			}
			this.form.submitting = true
			this.form.error = ''
			let result
			/!*try {
				result = await this.action()
				this.form.submitting = false
				if (this.success) {
					this.success()
				}
			} catch (ex) {
				this.form.error = ex
				this.form.submitting = false
				//this.notifyError('Error submitting the form')
			}*!/

			return result
		}*/
	}
})
</script>
