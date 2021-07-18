<template>
	<Fragment role="loading-container" class="loading-container">
		<template v-if="loading">
			<slot name="loading">
				<div class="loading-message">Loading...</div>
			</slot>
		</template>
		<template v-if="error">
			<slot name="error">
				<div class="error">
					{{error}}
				</div>
			</slot>
		</template>
		<template v-if="!loading && !error">
			<slot />
		</template>
	</Fragment>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Prop} from "nuxt-property-decorator";
import {Fragment} from "vue-fragment"
@Component({
	components: {
		Fragment: Fragment
	}
})
export default class LoadingContainer extends Vue {
	@Prop() loading: boolean
	@Prop() error: string
}
</script>
