<script setup lang="ts">
import { Api, type Cosplayer, type Juror } from "@/api";
import { ref } from "vue";

const order = ref<number>(0);
const jury = ref<Juror[]>([]);
const cosplayer = ref<Cosplayer>();
const vote = ref<number>();

const disabledButtons = ref(false);

const selectedJuror = ref<Juror | undefined>();

const selectJuror = (juror: Juror) => (selectedJuror.value = juror);

const selectNextCosplayer = (): void => {
  const currentOrder = order.value + 1;

  Api.getCosplayers({ fromOrder: currentOrder, confirmedOnly: true })
    .then((c) => {
      cosplayer.value = c;
      order.value = c.order!;
      disabledButtons.value = false;
    })
    .catch(() => (cosplayer.value = undefined));
};

const sendVote = () => {
  if (!selectedJuror.value && !vote.value && !cosplayer.value) {
    alert("Algo de ruim aconteceu.");
    return;
  }

  disabledButtons.value = true;

  Api.sendVote(selectedJuror.value!, { name: cosplayer.value!.name, score: vote.value! }).catch(console.error);

  selectNextCosplayer();
};

Api.getJury().then((j) => (jury.value = j));
selectNextCosplayer();
</script>

<template>
  <v-container v-if="selectedJuror === undefined">
    <v-row v-for="juror in jury" :key="juror.name">
      <v-col class="jurorButton">
        <v-btn size="x-large" @click="selectJuror(juror)">
          {{ juror.name }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>

  <v-container v-if="selectedJuror">
    <v-row>
      <v-sheet rounded class="jurorName">
        <span class="text-h6">
          {{ selectedJuror.name }}
        </span>
      </v-sheet>
    </v-row>

    <span v-if="cosplayer">
      <v-row class="cosplayerRow">
        <v-sheet rounded min-width="85%">
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

      <v-row>
        <div class="buttons">
          <v-number-input label="Pontuação" control-variant="split" :min="0" :max="10" v-model="vote" />
          <v-btn size="large" :disabled="disabledButtons" @click="sendVote">Enviar</v-btn>
        </div>
      </v-row>
    </span>

    <v-row v-if="cosplayer === undefined"> Acabaram os cosplayers! </v-row>
  </v-container>
</template>

<style lang="css" scoped>
.v-row {
  place-content: center;
}

span .v-row {
  margin: 15px 0;
}

.jurorButton {
  display: flex;
  justify-content: center;
}

.jurorName {
  padding: 1rem 2rem;
  text-align: center;
  width: 15%;
  margin-bottom: 35px;
}

.cosplayerRow {
  justify-content: center;
}

.text-h5 {
  color: var(--ctp-frappe-red);
}

.text-h6 {
  color: var(--ctp-frappe-peach);
}

.buttons {
  display: flex;
  flex-flow: column;
  place-items: center;
}

.v-number-input {
  min-width: 300px;
}
</style>
