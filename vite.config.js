import { defineConfig } from 'vite';

// GitHub Pages は /CC-CloudCandy/ 配下で配信されるため、その場合のみベースパスを付ける
// （GitHub Actions では GITHUB_ACTIONS=true が自動で設定される）
// Cloudflare などルート配信では '/'
export default defineConfig({
    base: process.env.GITHUB_PAGES === 'true' || process.env.GITHUB_ACTIONS === 'true' ? '/CC-CloudCandy/' : '/',
    // wrangler が Vite 設定を認識できるよう plugins 配列を明示する
    plugins: [],
});
