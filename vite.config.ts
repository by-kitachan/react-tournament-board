import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import * as packageJson from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'bundle',
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies)],
    },
  },
  plugins: [reactRefresh()],
});
