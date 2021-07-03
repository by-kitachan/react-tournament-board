import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import * as packageJson from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'react-tournament-board',
    },
    rollupOptions: {
      external: [
        ...Object.keys(packageJson.dependencies),
        ...Object.keys(packageJson.peerDependencies),
      ],
    },
  },
  plugins: [reactRefresh()],
});
