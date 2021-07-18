<template>
	<article>
		<h1>Upload</h1>
		<div v-if="!isCreator">
			You are not a creator.
		</div>
		<div v-else>
			<p>Choose which Creator to upload as</p>
			<LoadingContainer :loading="$fetchState.pending" :error="$fetchState.error">
				<ul>
					<li v-for="creator in creators" :key="creator.id">
						<nuxt-link :to="{name: 'upload-as-id', params: {id: creator.id}}">{{creator.name}}</nuxt-link>
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

@Component
export default class UploadPage extends Vue {
	creators : Creator[]

	@Getter('isCreator') isCreator : boolean

	async fetch () {
		const creatorsRes = await getMyCreators()
		this.creators = creatorsRes.creators
		if (this.creators.length == 1) {
			this.$nuxt.context.redirect(`/upload/as/${this.creators[0].id}`)
			return
		}
	}
}
</script>
