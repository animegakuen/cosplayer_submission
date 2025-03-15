<script setup lang="ts">
import { ref, type Ref } from "vue";
import { Api, type Cosplayer } from "@/api";

const props = defineProps({
  order: Number,
});

const files: Ref<{ file: File; base64Url: string }[]> = ref([]);

const displayError = ref(false);
const errorMessage = ref("Um ou mais campos estão inválidos ou há campos obrigatórios não preenchidos.");

const displaySuccess = ref(false);

const cosplayer = ref<Cosplayer & { valid: boolean }>({
  valid: true,
  confirmed: false,
  characterName: "",
  document: "",
  email: "",
  images: [],
  name: "",
  nickname: "",
  origin: "",
  phoneNumber: "",
});

if (props.order) {
  Api.getCosplayers({ order: props.order }).then((c) => {
    cosplayer.value = {
      valid: true,
      confirmed: c.confirmed,
      characterName: c.characterName,
      document: c.document,
      email: c.email,
      images: c.images,
      name: c.name,
      nickname: c.nickname,
      origin: c.origin,
      phoneNumber: c.phoneNumber,
    };
  });
}

const previewFiles = (event: Event) => {
  const eventFiles = (event.target as HTMLInputElement).files;

  if (!eventFiles?.length) return;

  for (const file of eventFiles) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => files.value.push({ file, base64Url: reader.result as string });
  }
};

const click = async () => {
  if (!cosplayer.value.valid) {
    displayError.value = true;
    return;
  }

  cosplayer.value.images = files.value.map((f) => f.base64Url);

  Api.sendCosplayers(cosplayer.value)
    .then(() => {
      displayError.value = false;
      displaySuccess.value = true;
      setTimeout(() => location.reload(), 3000);
    })
    .catch((error) => {
      errorMessage.value = error;

      displayError.value = true;
    });
};

const rules = {
  name: [
    (value: string) => {
      if (value) return true;

      return "Nome é obrigatório.";
    },
  ],
  phone: [
    (value: string) => {
      if (value.length === 11) return true;

      return "Número inválido, deve conter 11 números.";
    },
  ],
};
</script>

<template>
  <v-alert :text="errorMessage" title="Erro ao enviar" type="error" v-if="displayError" />
  <v-alert text="Seu cosplay foi enviado com sucesso." title="Sucesso" type="success" v-if="displaySuccess" />
  <v-form v-model="cosplayer.valid" validate-on="invalid-input" @submit.prevent="click">
    <v-container v-model="cosplayer.valid">
      <v-row>
        <v-col>
          <v-text-field :rules="rules.name" label="Seu nome completo*" v-model="cosplayer.name" />
        </v-col>

        <v-col>
          <v-text-field label="Nome de palco" v-model="cosplayer.nickname" />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-text-field :rules="rules.name" label="Nome do personagem de cosplay*" v-model="cosplayer.characterName" />
        </v-col>

        <v-col>
          <v-text-field :rules="rules.name" label="Origem do personagem*" v-model="cosplayer.origin" />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-text-field label="Endereço de e-mail" type="email" v-model="cosplayer.email" />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-text-field :rules="rules.phone" label="Número de telefone com DDD*" v-model="cosplayer.phoneNumber" />
        </v-col>

        <v-col>
          <v-text-field label="Número de documento (RG/CPF/CNH)" v-model="cosplayer.document" />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-file-input accept="image/*" label="Anexe seu arquivo" multiple @change="previewFiles" />
        </v-col>
      </v-row>

      <v-row>
        <v-col style="display: flex; justify-content: center">
          <v-dialog max-width="500">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn v-bind="activatorProps" size="x-large" text="Enviar" />
            </template>

            <template v-slot:default="{ isActive }">
              <v-card title="Tem certeza que quer enviar?">
                <v-card-actions>
                  <v-btn text="Não" @click="isActive.value = false" />
                  <v-btn text="Sim" type="submit" @click="
                    isActive.value = false;
                  click();
                  " />
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-carousel v-if="files.length" show-arrows="hover" cycle>
            <v-carousel-item v-for="fileData in files" :key="fileData.file.name" :src="fileData.base64Url" />
          </v-carousel>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
