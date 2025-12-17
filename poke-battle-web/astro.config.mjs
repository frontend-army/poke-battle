import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://frontend-army.github.io/poke-battle/",
  base: "/poke-battle",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  output: "static"
});
