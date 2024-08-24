<template>
    <footer class="bg-gray-800 text-white py-8">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center">
          <p>{{ $t('footer.copyright') }}</p>
          <div>
            <a href="#" class="mr-4 hover:text-blue-300">{{ $t('footer.links.privacy') }}</a>
            <a href="#" class="hover:text-blue-300">{{ $t('footer.links.terms') }}</a>
          </div>
        </div>
      </div>
    </footer>
  </template>