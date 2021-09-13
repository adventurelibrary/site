<script lang="ts">
import {Component, Vue} from "nuxt-property-decorator";

@Component
export default class StopPropagation extends Vue {
  stopPropagation (e: MouseEvent) {
    e.stopPropagation()
    return false
  }
}
</script>
