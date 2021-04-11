<script lang="ts">
import FormErrors from "~/components/forms/FormErrors.vue";
import Vue from "vue"
import {Component} from "nuxt-property-decorator";

export const newForm = (data = {}) => {
	return {
		data: data,
		error: '',
		submitting: true
	}
}

@Component({
  components: {
    FormErrors: FormErrors
  }
})
export default class FormMixin extends Vue {
  public form = newForm()
  public formSuccessMessage = 'Form submitted'
  validateForm () : string {
    return ''
  }

  // This should be overwritten by any component
  // that implements this mixin
  async formAction () {
		throw new Error('Form action needs to be implemented by the inheriting component')
  }

  async formSuccess () {
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
			console.log('doing the form action')
      await this.formAction()
			console.log('done the form action')
      this.form.submitting = false
      await this.formSuccess()
    } catch (ex) {
      this.form.error = ex.toString()
      this.form.submitting = false
      this.notifyError('Error submitting form:' + ex.toString())
    }
  }
}
</script>
