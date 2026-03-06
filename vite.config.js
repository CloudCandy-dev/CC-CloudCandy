import { defineConfig } from 'vite';

export default defineConfig({
    // GitHub Pages のサブディレクトリ対応
    // https://username.github.io/CC-CloudCandy/ でホスティングする場合
    // ユーザー名.github.io 直下にデプロイする場合は '/' に変更
    base: '/CC-CloudCandy/',
});
