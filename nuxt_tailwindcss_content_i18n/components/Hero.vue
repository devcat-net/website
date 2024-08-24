<template>
  <section class="bg-blue-600 text-white py-20">
    <div class="mx-auto px-4 w-full">
      <div class="flex justify-between items-center">
        <div class="w-2/3">
          <h1 class="text-5xl font-bold mb-4">{{ $t('hero.title') }}</h1>
          <p class="text-xl mb-8">{{ $t('hero.subtitle') }}</p>
          <button class="bg-white text-blue-600 py-2 px-6 rounded-full font-bold hover:bg-blue-100 transition duration-300">
            {{ $t('hero.cta') }}
          </button>
        </div>
        <div class="ml-auto">
          <LanguageSelector />
        </div>
      </div>
    </div>
  </section>
</template>