// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/i18n", "@nuxt/content"],
  i18n: {
    locales: [
      {
        code: "en",
        iso: "en-US",
        name: "English",
        file: "en-US.json",
      },
      {
        code: "de",
        iso: "de-DE",
        name: "Deutsch",
        file: "de-DE.json",
      },
    ],
    defaultLocale: "en",
    langDir: "locales/",
    strategy: "prefix_except_default",
  },
});
