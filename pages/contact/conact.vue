<template>
	<div>
        CONTACT
	</div>
</template>


<script lang="ts">
import {Component, State, Vue} from "nuxt-property-decorator";
import {User} from "~/lib/users/user-types"

export default class Contact extends Vue {
	@State('user') user : User
	

}
</script>
