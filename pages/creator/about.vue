<template>
	<div>
        CREATOR ABOUT

        >> {{this.$route.params}}

        https://www.notion.so/adventurelibrary/DS-v1-1-dc7e75db0fec48c09062f8ef0060d91e

        Users.display_name
        Users.profile_picture_url
        Users.creator_id

        Creators._id
        Creators.cover_img
        Creators.creator_description

        [follow button]
        [list of creations]
	</div>
</template>




<script lang="ts">
import {Component, State, Vue} from "nuxt-property-decorator";
import {User} from "~/lib/users/user-types"
import {Creator} from "~/modules/creators/creator-types";

export default class CreatorAbout extends Vue {
	@State('user') user : User	

/*
    async asyncData({ $route.params, $http }) {
      // v1/creator/{creatorID}
      const creator = await $http.$get(`https://api.nuxtjs.dev/posts/${params.id}`)
      return { creator }
    }*/
}



</script>
