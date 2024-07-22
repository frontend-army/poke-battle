import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: 'https://frontend-army.github.io/poke-battle/',
  base: 'poke-battle/poke-battle-web/',
  integrations: [tailwind(), react()],
});
