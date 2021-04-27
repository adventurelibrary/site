<template>
	<div>
		<button type="button" @click="addAssets">Add Assets</button>
		<button type="button" @click="openEditBundle">Edit Bundle</button>
		<button type="button" @click="deleteBundle">Delete Bundle</button>
	</div>
</template>
<script lang="ts">
import Vue from "vue"
import {Component} from "nuxt-property-decorator";
import {Bundle} from "~/lib/bundles/bundle-types";
import {deleteBundle} from "~/lib/bundles/bundles-api";

@Component
export default class FakeBundle extends Vue {
	bundle : Bundle = {
		id: 'fdsafdsasa',
		description: 'This is a fake bundle used for testing',
		name: 'My Fake Bundle',
		public: true,
		numAssets: 10
	}

	async openEditBundle () {
		this.$store.dispatch('openEditBundleModal', {
			bundle: this.bundle
		})
	}

	async addAssets () {
		console.log('add')
		this.$store.dispatch('openBundleAddAssetsModal', {
			bundle: this.bundle
		})
	}

	async deleteBundle () {
		if (prompt('Type DELETE to delete bundle') !== 'DELETE') {
			return
		}

		try {
			await deleteBundle(this.bundle.id)
			this.notifySuccess('Bundle deleted')
			await this.$router.push('/') // TODO: Redirect to my bundles
		} catch (ex) {
			this.notifyError(ex)
		}
	}
}
</script>
