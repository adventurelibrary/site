<template>
	<div class="form-group">
		<label class="form-label">{{label}}</label>
		<slot></slot>
	</div>
</template>
<script lang="ts">
import Vue from "vue"

export default Vue.extend({
	name: 'FormGroup',
	props: ['label'],
})
</script>
