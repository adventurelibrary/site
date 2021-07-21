<template>
	<span class="user-coins">{{numCoins}} {{label}}</span>
</template>
<script lang="ts">
import {Component, State} from "nuxt-property-decorator";
import Vue from "vue";

// This component is for showing the currently logged in user's current coin
// balance. It will listen to the appropriate changes (from coin purchases
// and asset unlocks) to automatically update the amount of coins displayed
@Component
export default class UserCoins extends Vue {
	@State('userCoins') numCoins : number

	get label () : string {
		return 'Coin' + (this.numCoins == 1 ? '' : 's')
	}
}
</script>
