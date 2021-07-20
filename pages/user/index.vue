<template>
	<ProfilePage active-tab="settings">
		<nuxt-link :to="{name: 'account-change-password'}">Change Password</nuxt-link>
		<Fragment slot="actions">
			<a v-if="!isCreator" href="https://docs.google.com/forms/d/1e_7ori6eqo7OczyuqvLpFsBSY-Ke3aNwEiVztTVygvY/viewform" target="_blank" class="button upgrade">Become An Artist</a>
		</Fragment>		

		<!-- Admin user details and links -->
		<div v-if="user.admin==true">
			<h2>Administrator Section</h2>
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
	@State('user') user : User
	@Getter('isCreator') isCreator : boolean
}
</script>
