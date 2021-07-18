<template>
	<article>
        CONTACT US
	</article>
</template>


<script lang="ts">
import {Component, State, Vue} from "nuxt-property-decorator";
import {User} from "~/modules/users/user-types"

@Component
export default class Contact extends Vue {
	@State('user') user : User
}
</script>
