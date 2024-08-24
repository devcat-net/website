<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-4">{{ $t('content.title') }}</h1>
    <ContentDoc class="prose lg:prose-lg" :path="contentPath" />
    <NuxtLink 
      :to="localePath('/')" 
      class="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
    >
      {{ $t('content.back_to_home') }}
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const localePath = useLocalePath()

const contentPath = computed(() => `/${locale.value}/content`)
</script>