<template>
	<article>
		<h1>Upload</h1>
		<div v-if="!isCreator">
			You are not a creator.
		</div>
		<div v-else>
			<p>Choose which Creator to manage</p>
			<LoadingContainer :loading="$fetchState.pending" :error="$fetchState.error">
				<ul>
					<li v-for="creator in creators" :key="creator.id">
						<nuxt-link :to="{name: 'creators', params: {id: creator.id}}">{{creator.name}}</nuxt-link>
					</li>
				</ul>
			</LoadingContainer>
		</div>
	</article>
</template>
<script lang="ts">

import {Component, Vue, Getter} from "nuxt-property-decorator";
import {getMyCreators} from "~/modules/creators/creator-api";
import {Creator} from "~/modules/creators/creator-types";

@Component({
	middleware: ['require_auth']
})
export default class UploadPage extends Vue {
	creators : Creator[] = []

	@Getter('isCreator') isCreator : boolean

	async fetch () {
		// If the current user isn't a creator, don't even bother getting the list
		if (!this.isCreator) {
			return
		}
		const creatorsRes = await getMyCreators()
		this.creators = creatorsRes.creators

		// No need to show them the list if they only have access to one creator
		if (this.creators.length == 1) {
			this.$nuxt.context.redirect(`/creators/${this.creators[0].id}/assets`)
			return
		}
	}
}
</script>
