<template>
    <section class="py-20">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">{{ $t('features.title') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="i in 3" :key="i" class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-2">{{ $t(`features.feature${i}.title`) }}</h3>
            <p>{{ $t(`features.feature${i}.description`) }}</p>
          </div>
        </div>
      </div>
    </section>
  </template>