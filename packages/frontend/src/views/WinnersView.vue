<script setup lang="ts">
import { Api, type Cosplayer, type Vote } from "@/api";
import { ref } from "vue";

const votes = ref<Vote[]>([]);
const dataFromWinners = ref<Cosplayer[]>([]);

const getWinnerData = (index: number): Cosplayer | undefined => {
  return dataFromWinners.value[index];
};

Api.getWinners().then((w) => {
  votes.value = w;

  [0, 1, 2].forEach((i) => {
    Api.getCosplayers({ name: w[i].name })
      .then((c) => {
        dataFromWinners.value[i] = c;
        w[i].name = [undefined, null, ""].includes(c.nickname) ? c.name : c.nickname;
      })
      .catch(console.error);
  });
});
</script>

<template>
  <v-container>
    <v-row class="cosplayerRow" v-for="(vote, index) in votes" :key="vote.name">
      <v-sheet rounded>
        <v-container>
          <v-row>
            <v-col>
              <h5 class="text-h5">Nome</h5>
              {{ vote.name }}
            </v-col>

            <v-col>
              <h5 class="text-h5">Pontuação total</h5>
              {{ vote.score }}
            </v-col>
          </v-row>

          <v-row v-if="index <= 2">
            <v-col>
              <h5 class="text-h5">Personagem</h5>
              {{ getWinnerData(index)?.characterName }}
            </v-col>

            <v-col>
              <h5 class="text-h5">Origem</h5>
              {{ getWinnerData(index)?.origin }}
            </v-col>
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
