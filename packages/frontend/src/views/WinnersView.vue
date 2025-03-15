<script setup lang="ts">
import { Api, type Vote } from "@/api";
import { ref } from "vue";

const votes = ref<Vote[]>([]);

Api.getWinners().then((c) => (votes.value = c));
</script>

<template>
  <v-container>
    <v-row class="cosplayerRow" v-for="vote in votes" :key="vote.name">
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
