<template>
	<article class="user-profile">
		<section class="profile-details">
			<h1 class="username" v-if="creator.name">{{creator.name}}</h1>
		</section>
		<nav class="tabs" v-if="creator">
			<nuxt-link
					:to="{name: 'creators-id-assets', params: {id: creator.id}}"
					class="tab-control"
					:class="{active: activeTab === 'assets'}">
				Assets
			</nuxt-link>
			<nuxt-link
					:to="{name: 'creators-id', params: {id: creator.id}}"
					class="tab-control"
					:class="{active: activeTab === 'index'}">
				Settings
			</nuxt-link>
			<nuxt-link
				:to="{name: 'creators-id-upload', params: {id: creator.id}}"
				class="tab-control"
				:class="{active: activeTab === 'upload'}">
				Upload
			</nuxt-link>
			<slot name="actions"></slot>
		</nav>
		<section class="tab active" v-if="creator">
			<slot></slot>
		</section>
	</article>
</template>
<script lang="ts">
import {Component, State, Vue, Prop, Getter} from "nuxt-property-decorator";
import {Creator} from "~/modules/creators/creator-types";
import LoadingContainer from "~/components/LoadingContainer.vue";

// This component is like a mini-layout for the routes at `/user/XXX`
// It accepts a slot for the specific page's content
@Component({
	components: {LoadingContainer},
	middleware: ['require_auth']
})
export default class CreatorPage extends Vue {
	@Getter('isCreator') isCreator : boolean
	@Prop() activeTab : string
	@Prop() creator : Creator
}
</script>
