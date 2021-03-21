<script lang="ts">
import FormErrors from "~/components/forms/FormErrors.vue";

export const newForm = (data = {}) => {
	return {
		data: data,
		error: '',
		submitting: true
	}
}

export const FormMixin = {
	components: {
		FormErrors: FormErrors
	},
	data () {
		return {
			form: newForm()
		}
	},
	methods: {
		async submit(e) {
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
			try {
				result = await this.action()
				this.form.submitting = false
				if (this.success) {
					this.success()
				} else if (this.successMessage) {
					this.notifySuccess(this.successMessage)
				}
			} catch (ex) {
				this.form.error = ex
				this.form.submitting = false
				this.notifyError('Error submitting the form')
			}

			return result
		}
	}
}
</script>
