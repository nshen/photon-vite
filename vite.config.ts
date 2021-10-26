import { defineConfig } from "vite";
import wasmPack from "vite-plugin-wasm-pack";

export default defineConfig({
  base: "/photon-vite/",
  build: {
    minify: false,
  },
  // we have no local crate, so leave the first param an empty array
  plugins: [wasmPack([], ["photon-web"])],
});
