import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  server: {
    https: true,
    headers: {
      "x-test": "lol",
      //   "Feature-Policy": "usb *",
    },
  },
  plugins: [mkcert()],
});
