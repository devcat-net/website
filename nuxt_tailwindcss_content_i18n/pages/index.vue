<template>
  <div>
    <h1 class="mt-4 text-4xl font-bold text-center">
      {{ $t("headline") }}
    </h1>
    <p class="text-center">{{ $t("subheadline") }}</p>
    <form class="text-center">
      <select v-model="locale">
        <option value="en">English</option>
        <option value="de">Deutsch</option>
      </select>
    </form>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n();
</script>
