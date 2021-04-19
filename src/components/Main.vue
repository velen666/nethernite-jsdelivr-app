<template>
  <v-container>
    <SearchList />
  </v-container>
</template>

<script>
import SearchList from '@/components/SearchList.vue';

export default {
  name: 'Main',
  components: {
    SearchList,
  }
}
</script>
