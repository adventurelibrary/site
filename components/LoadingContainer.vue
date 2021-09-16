<template>
	<Fragment role="loading-container" class="loading-container">
		<template v-if="loading">
			<SignOfLife>
				<slot name="loading">Loading...</slot>
			</SignOfLife>
		</template>
		<template v-if="!loading && errorMessage">
			<slot name="error">
				<div class="error">
					{{errorMessage}}
				</div>
			</slot>
		</template>
		<template v-if="!loading && !errorMessage">
			<slot />
		</template>
	</Fragment>
</template>

<script lang="ts">
import Vue from "vue"
import {Component, Prop} from "nuxt-property-decorator";
import {Fragment} from "vue-fragment"
import SignOfLife from "~/components/SignOfLife.vue";

@Component({
	components: {
		Fragment: Fragment,
		SignOfLife
	}
})
export default class LoadingContainer extends Vue {
	@Prop() loading: boolean
	@Prop() error: any

	get errorMessage () : string {
		if (!this.error) {
			return ''
		}
		if (this.error.message) {
			return this.error.message
		}
		if (typeof this.error === 'object' && Object.keys(this.error).length === 0) {
			return ''
		}
		return this.error
  	}

  	mounted () {

		// display Nuxt loading
		/*
		this.$nextTick(() => {
			console.log('display Nuxt loading bar, from LoadingContainer')
			this.$nuxt.$loading.start()
			setTimeout(() => this.$nuxt.$loading.finish(), 500)
		})
		*/
	}
}
</script>
