<template>
	<ProfilePage active-tab="settings">

		<!-- General User Settings -->
		<h3>General Settings</h3>
		<nuxt-link :to="{name: 'account-change-password'}">Change Password</nuxt-link>

		<Fragment slot="actions">
			<a v-if="!isCreator" href="https://docs.google.com/forms/d/1e_7ori6eqo7OczyuqvLpFsBSY-Ke3aNwEiVztTVygvY/viewform" target="_blank" class="button cta">Become An Artist</a>
		</Fragment>

		<!-- Creator Settings  -->
		<Fragment v-if="isCreator">
			<h3>Creator Settings</h3>
			<nuxt-link :to="{name: 'upload'}">Upload Asset</nuxt-link>
		</Fragment>

		<!-- Admin Settings -->
		<Fragment v-if="user && user.admin==true">
			<h3>Administrator Settings</h3>
			User to Creator<br/>
			Creator to User<br/>
			Creator to Admin<br/>
			Admin to Creator<br/>
		</Fragment>

	</ProfilePage>
</template>
<script lang="ts">
import Vue from "vue";
import {Component, Getter, State} from "nuxt-property-decorator";
import {User} from "~/modules/users/user-types"
import ProfilePage from "@/pages/user/-components/ProfilePage.vue";
import {Fragment} from "vue-fragment";
@Component({
	middleware: ['require_auth'],
	components: {
		ProfilePage,
		Fragment: Fragment
	}
})
export default class UserSettings extends Vue {
	@State('user') user : User
	@Getter('isCreator') isCreator : boolean
}
</script>
