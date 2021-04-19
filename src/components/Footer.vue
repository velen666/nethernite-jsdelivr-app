<template>
  <v-footer
    dark
    padless
  >
    <v-card
      flat
      tile
      width="100%"
      class="blue white--text text-center"
    >

      <v-card-text class="white--text pt-10 pb-10">
        <v-row class="align-end">
          <v-col cols="5">
            <a href="https://github.com/velen666">
              <v-icon
                large
                color="indigo darken-4"
              >
                mdi-git
              </v-icon>
            </a>
          </v-col>

          <v-col 
            cols="5" 
          >
            <div>
              Буров Алексей
            </div>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-text class="white--text">
        {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    
  }),
}
</script>

<style>

</style>
