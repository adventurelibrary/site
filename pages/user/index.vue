<template>
	<ProfilePage active-tab="settings">
		settings here I guess
		<Fragment slot="actions">
			<a v-if="!isCreator" @click="becomeAnArtist" class="button upgrade">Become An Artist</a>
		</Fragment>
	</ProfilePage>
</template>
<script lang="ts">
import Vue from "vue";
import {Component, Getter} from "nuxt-property-decorator";
import ProfilePage from "@/pages/user/components/ProfilePage.vue";
import {Fragment} from "vue-fragment";
@Component({
	middleware: ['require_auth'],
	components: {
		ProfilePage,
		Fragment: Fragment
	}
})
export default class UserSettings extends Vue {
	@Getter('isCreator') isCreator : boolean
}
</script>
