import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages hosts project sites beneath /<repository>/, while Vercel and
// local development use the domain root. Never hard-code the Pages prefix in
// the normal production build.
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === "true" ? "/FINANCE-OS/" : "/"
});
