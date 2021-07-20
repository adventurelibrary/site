<template>
	<ProfilePage active-tab="info">
		<!-- Default user details and links -->
		<Fragment>
			<div v-if="user">
				<ul>
					<li><nuxt-link :to="{name: 'account-purchase-history'}">Purchase History</nuxt-link></li>
				</ul>			
			</div>
		</Fragment>
	</ProfilePage>
</template>


<script lang="ts">
import {Component, State, Vue} from "nuxt-property-decorator";
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
export default class UserInfoPage extends Vue {
	@State('user') user : User
}
</script>
