import { defineConfig } from 'vite';
import vitePluginLinaria from 'vite-plugin-linaria';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'docs',
  },
  plugins: [vitePluginLinaria()],
});
