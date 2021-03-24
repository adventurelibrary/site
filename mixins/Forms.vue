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
		console.log('using super validate')
    return ''
  }

  // This should be overwritten by any component
  // that implements this mixin
  async formAction () {

  }

  async formSuccess () {
    this.notifySuccess(this.formSuccessMessage)
  }

  async submit (e: any) {
    console.log('submit')
    e.preventDefault()
    const err = this.validateForm()
		console.log('err', err)
    if (err !== '') {
      this.form.error = err
      this.form.submitting = false
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
      this.notifyError('Error submitting form:' + ex.toString())
    }
  }
}
</script>
