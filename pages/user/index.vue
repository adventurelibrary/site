<template>
	<ProfilePage active-tab="settings">

		<!-- General User Settings -->
		<h3>General Settings</h3>
		<nuxt-link :to="{name: 'account-change-password'}">Change Password</nuxt-link>
		<a class="logout-button" @click="logout">Logout</a>

		<Fragment slot="actions">
			<a v-if="!isCreator" href="https://docs.google.com/forms/d/1e_7ori6eqo7OczyuqvLpFsBSY-Ke3aNwEiVztTVygvY/viewform" target="_blank" class="button cta">Become An Artist</a>
		</Fragment>

		<!-- Creator Settings  -->
		<div v-if="isCreator">
			<h3>Creator Settings</h3>
			<nuxt-link :to="{name: 'upload'}">Upload Asset</nuxt-link>
		</div>

		<!-- Admin Settings -->
		<div v-if="user && user.admin==true">
			<h3>Administrator Settings</h3>
			User to Creator<br/>
			Creator to User<br/>
			Creator to Admin<br/>
			Admin to Creator<br/>
		</div>

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

	async logout () {
		await this.$store.dispatch('logout')
		this.notifySuccess('Logged out')
		this.$root.$emit('loggedOut')
		console.log('pushing route home')
		await this.$store.$router.push('/info/about-us')
		console.log('done on home')
	}
}
</script>
