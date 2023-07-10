<template>
  <DefaultLayout class="account-container">
    <div class="account-header">

    </div>
  </DefaultLayout>
</template>

<route>
{
  "name": "accounts"
}
</route>

<script lang="ts">
import { defineComponent } from "vue"
import DefaultLayout from '@/layouts/default/index.vue'

export default defineComponent({
  name: 'Accounts',
  components: {
    DefaultLayout
  },
  mounted () {
    const accountId = this.$route.params.accountId
  }
})
</script>
