<template>
  <div>
    <h1>My Bundles</h1>
    <LoadingContainer :loading="bundlesAjax.loading" :error="bundlesAjax.error">
      <div>Showing {{bundles.length}}. Total: {{totalBundles}}</div>
      <ul>
        <li v-for="bundle in bundles" :key="bundle.id">
          {{bundle.name}}
        </li>
      </ul>
      <Pagination
          :items-per-page="20"
          :total-items="totalBundles"
          :active-page="activePage"
          :to="{name: 'my-bundles'}"
      />
    </LoadingContainer>
  </div>
</template>
<script lang="ts">
import {Component, mixins} from "nuxt-property-decorator";
import {computeAjaxList, computeAjaxTotal, doAjax, newAjax} from "~/lib/ajax";
import {Bundle, BundlesResponse} from "~/lib/bundles/bundle-types";
import {getMyBundles} from "~/lib/bundles/bundles-api";
import PaginationMixin, {getRouteQueryPage} from "~/mixins/PaginationMixin.vue";
import {Context} from "@nuxt/types";

@Component({
  middleware: ['require_auth']
})
export default class MyBundles extends mixins(PaginationMixin) {
  bundlesAjax = newAjax<BundlesResponse>()

  // This function fires client side when the ?page query parameter is changed
  // Nuxt won't do a full route change cycle (which would call asyncData) if only
  // the query params change. So, we watch the query params ourselves with the PaginationMixin
  // and just do an ajax call when the page changes
  async pageChanged () {
    doAjax<BundlesResponse>(this.bundlesAjax, async () => {
      return await getMyBundles(this.activePage)
    })
  }

  async asyncData (ctx : Context) {
    const ajax = newAjax<BundlesResponse>()
    const page = getRouteQueryPage(ctx.route)
    await doAjax<BundlesResponse>(ajax, async () => {
      return await getMyBundles(page)
    })
    return {
      bundlesAjax: ajax
    }
  }

  get bundles () : Bundle[] {
    return computeAjaxList(this.bundlesAjax, 'bundles')
  }

  get totalBundles () : number {
    return computeAjaxTotal(this.bundlesAjax)
  }
}
</script>
