import { defineConfig } from 'vite';

// GitHub Pages は /CC-CloudCandy/ 配下で配信されるため、その場合のみベースパスを付ける
// （GitHub Actions のワークフローで GITHUB_PAGES=true を指定）
// Cloudflare Pages などルート配信では '/'
export default defineConfig({
    base: process.env.GITHUB_PAGES === 'true' ? '/CC-CloudCandy/' : '/',
});
