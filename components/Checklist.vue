<template>
  <ol>
    <li v-for="opt in options" :key="opt.value">
      <label>
        <input
          :value="opt.value"
          type="checkbox"
          v-model="checkedMap[opt.value]"
          @change="onChange"
          />
          {{opt.label}}
      </label>
    </li>
  </ol>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Prop, Watch} from "nuxt-property-decorator"
import {keyBoolToArray} from "adventurelibrary/dist/helpers";

interface CheckOption {
  value: string
  label: string
}

interface CheckListI {
  checkedMap: Record<string, boolean>
}

@Component
export default class Checklist extends Vue implements CheckListI {
  public checkedMap : Record<string, boolean> = {}
  @Prop() options : CheckOption[] // Our array of options to show. EG: [{value: 'CA', label: 'Canada'}]
  @Prop() checked : string[] // Our array of selected options. They should match 'value' of options. EG: ['CA']

	// When a value is changed we emit to parent component so it can update
	// Vue doesn't do two way data binding between child/parent components
	// it does one way data binding down, and event emits up
  onChange () {
    this.$emit('changed', keyBoolToArray(this.checkedMap))
  }

  // Builds out the map that the checkboxes use to determine what is on/off
  buildCheckedMap () {
    const map : Record<string, boolean> = {};
    this.options.forEach((option: CheckOption) => {
      map[option.value] = this.checked.indexOf(option.value) >= 0
    })
    this.checkedMap = map
  }

  @Watch('options', {
    immediate: true,
    deep: true
  })
  optionsChanged () {
    this.buildCheckedMap()
  }

  @Watch('checked', {
    immediate: true,
    deep: true
  })
  checkedChanged () {
    this.buildCheckedMap()
  }
}
</script>
<style scoped="true">
ol {
	list-style: inside none;
}
ol li {
	list-style: none;
}
</style>
