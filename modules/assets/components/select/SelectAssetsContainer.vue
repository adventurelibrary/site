<template>
  <div>
    <div>
			{{numSelected}} Selected
      <button @click="clickToggleAll">{{toggleAllLabel}}</button>
      <button @click="clickAddToBundle">Add to Bundle</button>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">

import {Component, Getter, Prop} from "nuxt-property-decorator";
import Vue from "vue";

@Component
export default class SelectAssetsContainer extends Vue {
  @Getter('assets/numSelectedAssets') numSelected : number

  clickToggleAll () {
    if (this.numSelected < this.numAssets) {
      console.log('select all of them')
    }
  }

	clickAddToBundle () {
		this.$store.dispatch('assets/openAddToBundle')
	}

  get toggleAllLabel () : string {
    return 'Select All'
  }
}
</script>
