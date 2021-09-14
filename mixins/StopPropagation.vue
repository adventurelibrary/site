<script lang="ts">
import {Component, Vue} from "nuxt-property-decorator";

/**
 * This is a simple mixin that gives our components the stopPropagation function
 * that they can use in their template.
 * This is used primarily on @mousedown events to prevent the DragSelect plugin
 * we're using from triggering when certain things happen. For example when someone
 * clicks the thumbnail of an asset, we don't want that to select the asset, so we use
 * this there
 */
@Component
export default class StopPropagation extends Vue {
  stopPropagation (e: MouseEvent) {
    e.stopPropagation()
    return false
  }
}
</script>
