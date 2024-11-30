<script setup lang="ts">
import { Api, type Cosplayer } from '@/api';
import { ref } from 'vue';

const cosplayers = ref<Cosplayer[]>([])

Api.getCosplayers().then(c => cosplayers.value = c.sort((a, b) => {
  if (a.order! > b.order!)
    return 1
  else
    return -1;
}));
</script>

<template>
  <v-container>
    <v-row class="cosplayerRow" v-for="cosplayer in cosplayers" :key="cosplayer.name">
      <v-sheet rounded>
        <v-container>
          <v-row>
            <v-col>
              <h5 class="text-h5">Nome</h5>
              {{ [undefined, null, ""].includes(cosplayer.nickname) ? cosplayer.name : cosplayer.nickname }}
            </v-col>

            <v-col>
              <h5 class="text-h5">Numero</h5>
              {{ cosplayer.order }}
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <h5 class="text-h5">Personagem</h5>
              {{ cosplayer.characterName }}
            </v-col>

            <v-col>
              <h5 class="text-h5">Origem</h5>
              {{ cosplayer.origin }}
            </v-col>
          </v-row>

          <v-row v-if="cosplayer.images.length">
            <v-carousel show-arrows="hover" cycle>
              <v-carousel-item v-for="img in cosplayer.images" :key="img" :src="img" />
            </v-carousel>
          </v-row>
        </v-container>
      </v-sheet>
    </v-row>
  </v-container>
</template>

<style scoped>
.cosplayerRow {
  justify-content: center;

  padding-bottom: 50px;
}

.v-sheet {
  min-width: 75%;
  max-width: 75%;
}

.text-h5 {
  color: var(--ctp-frappe-red);
}
</style>
