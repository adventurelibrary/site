<template>
  <main class="admin-layout">
    <header class="admin-header">
      Admin Header
			<div>
				<NuxtLink :to="{name: 'admin-assets'}">Assets</NuxtLink>
				<NuxtLink :to="{name: 'admin-assets-upload'}">Upload</NuxtLink>
				<NuxtLink :to="{name: 'admin-creators'}">Creators</NuxtLink>
			</div>
    </header>
		<div>

		</div>
    <main class="">
      <Nuxt />
    </main>
		<div class="toast-msgs">
			<div v-for="toast in toasts" :key="toast.id" class="toast-msg" :class="toast.type">
				{{toast.msg}}
			</div>
		</div>
  </main>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, State} from "nuxt-property-decorator";
import {Toast} from "~/store";

@Component
export default class AdminLayout extends Vue {
	@State('toasts') toasts : Toast[]
}
</script>
<style>
.admin-layout {
	max-width: 960px;
	margin: 1em auto;
}

.toast-msgs {
	position: fixed;
	right: 5px;
	bottom: 5px;
	height: auto;
}

.toast-msg {
	background: #fff;
	border: 1px solid #ccc;
	padding: 1em;
}

.toast-msg.success {
	background: lightgreen;
}


.toast-msg.danger {
	background: lightcoral;
}
</style>
