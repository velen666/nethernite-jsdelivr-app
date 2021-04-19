<template>
  <v-container>
    <v-row class="justify-center text-center">
      <v-col cols="6">
        <v-text-field
          v-model="message"
          append-icon="mdi-magnify"
          clear-icon="mdi-close-circle"
          clearable
          label="Search"
          single-line
          hide-details
          @click:append="searchPackage"
          @click:clear="clearMessage"
          @keyup.enter="searchPackage"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col cols="12">
        <v-container>
          <v-data-table
            v-if="packages"
            :headers="headers"
            :items="packages"
            @click:row="showDialogOnRowClick"
            sort-by="calories"
            class="elevation-22"
          >
            <template v-slot:top>
              <v-toolbar
                flat
              >
                <v-toolbar-title>Packages</v-toolbar-title>
                <v-divider
                  class="mx-4"
                  inset
                  vertical
                ></v-divider>
                <v-dialog
                  v-model="dialog"
                  max-width="500px"
                >
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-text-field
                              v-model="editedItem.name"
                              label="Name"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-text-field
                              v-model="editedItem.description"
                              label="Description"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-text-field
                              v-model="editedItem.license"
                              label="License"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-text-field
                              v-model="editedItem.version"
                              label="Version"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-text-field
                              v-model="editedItem.deprecated"
                              label="Deprecated"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col
                            cols="12"
                            sm="6"
                            md="6"
                          >
                            <v-text-field
                              v-if="editedItem && 
                                    editedItem.owner && 
                                    editedItem.owner.link"
                              v-model="editedItem.owner.link"
                              label="Owner link"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col
                            cols="12"
                            sm="6"
                            md="6"
                          >
                          <v-img
                            max-height="150"
                            max-width="250"
                            aspect-ratio="1"
                            :src="editedItem.owner.avatar"
                            alt="avatar logo"
                          ></v-img>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="close"
                      >
                        Cancel
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon
                small
                class="ml-3"
                @click="openPackage(item)"
              >
                mdi-folder
              </v-icon>
            </template>
            <template v-slot:no-data>
              <v-btn
                color="primary"
                @click="initialize"
              >
                Reset
              </v-btn>
            </template>
          </v-data-table>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'SearchList',
  data: () => ({
      dialog: false,
      dialogDelete: false,
      message: '',
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
        { text: 'License', value: 'license' },
        { text: 'Version', value: 'version' },
        { text: 'Deprecated', value: 'deprecated' },

        { text: 'Actions', value: 'actions', sortable: false },
      ],
      packages: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        description: '',
        license: '',
        version: '',
        deprecated: null,
        owner: {
          avatar: '',
          link: ''
        }
      },
      defaultItem: {
        name: '',
        description: '',
        license: '',
        version: '',
        deprecated: null,
        owner: {
          avatar: '',
          link: ''
        }
      },
    }),
    computed: {
      formTitle () {
        return `Package ${this.editedItem.name}`
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      packages (newValue, oldValue) {
        if (newValue) {
          this.$nextTick(() => {
            return newValue;
          })
        }

        if (oldValue) {
          this.$nextTick(() => {
            return oldValue;
          })
        }
      }
    },

    methods: {
      ...mapActions({
        getPackages: 'Package/getPopularPackages',
        search: 'Package/searchPackage',
      }),
      ...mapGetters({
        setPackages: 'Package/getPackages',
      }),
      ...mapMutations({
        clearPackagesState: 'Package/clearPackagesState',
      }),

      initialize () {
        this.packages = this.setPackages();
      },

      showDialogOnRowClick (item) {
        console.log(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      searchPackage () {
        this.search(this.message)
          .then(() => {
            this.$nextTick(() => {
              this.packages = [];
              this.packages = this.setPackages()
            })
          })
      },

      clearMessage () {
        this.$nextTick(() => {
          this.message = ''
          this.packages = []
          this.clearPackagesState()
        })
      },

      openPackage (item) {
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
    },
  }
</script>

<style>

</style>
