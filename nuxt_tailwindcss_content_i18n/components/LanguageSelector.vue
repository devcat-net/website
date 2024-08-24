<template>
  <select v-model="$i18n.locale" class="bg-white text-blue-600 py-2 px-4 rounded">
    <option v-for="locale in $i18n.locales" :key="locale.code" :value="locale.code">
      {{ locale.name }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { locale, locales } = useI18n();
</script>