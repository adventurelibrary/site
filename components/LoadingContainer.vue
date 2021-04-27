<template>
	<div role="loading-container">
		<div v-if="loading">
      <slot name="loading">
        Loading...
      </slot>
		</div>
		<div v-if="error" class="alert alert-danger">
      <slot name="error">
        {{error}}
      </slot>
		</div>
		<div v-if="!loading && !error">
			<slot />
		</div>
	</div>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Prop} from "nuxt-property-decorator";
@Component
export default class LoadingContainer extends Vue {
	@Prop() loading: boolean
	@Prop() error: string
}
</script>
