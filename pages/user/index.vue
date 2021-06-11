<template>
	<ProfilePage active-tab="settings">
		settings here I guess
	</ProfilePage>
</template>
<script>
import Vue from "vue";
import {Component} from "nuxt-property-decorator";
import ProfilePage from "@/pages/user/components/ProfilePage.vue";
@Component({
	middleware: ['require_auth'],
	components: {
		ProfilePage
	}
})
export default class UserSettings extends Vue {
}
</script>
