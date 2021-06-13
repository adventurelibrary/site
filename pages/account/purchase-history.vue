<template>
	<div>
		<div v-if="user">
			Purchase history.
		</div>
	</div>
</template>


<script lang="ts">
import {Component, State, Vue} from "nuxt-property-decorator";
import {User} from "~/modules/users/user-types"

@Component({
	middleware: ['require_auth']
})
export default class PurchaseHistory extends Vue {
	@State('user') user : User


}
</script>
