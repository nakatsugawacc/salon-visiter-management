# 🚀 Vercelへのデプロイガイド

## 方法1: Vercel CLIでデプロイ（最速）

### 1. Vercel CLIをインストール

```bash
npm install -g vercel
```

### 2. プロジェクトディレクトリに移動

```bash
cd visitor-demo
```

### 3. 依存関係をインストール

```bash
npm install
```

### 4. Vercelにログイン

```bash
vercel login
```

### 5. デプロイ

```bash
vercel
```

初回デプロイ時の質問に答える：
- Set up and deploy "visitor-demo"? → `Y`
- Which scope? → あなたのアカウントを選択
- Link to existing project? → `N`
- What's your project's name? → `visitor-demo` (またはお好みの名前)
- In which directory is your code located? → `./` (デフォルトのままEnter)

### 6. 本番環境にデプロイ

```bash
vercel --prod
```

完了！URLが表示されます（例: `https://visitor-demo.vercel.app`）

---

## 方法2: GitHubと連携（推奨）

### 1. GitHubリポジトリを作成

GitHub で新しいリポジトリを作成（例: `visitor-demo`）

### 2. プロジェクトをGitHubにプッシュ

```bash
cd visitor-demo
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/visitor-demo.git
git push -u origin main
```

### 3. Vercelと連携

1. https://vercel.com にアクセス
2. 「New Project」をクリック
3. GitHubアカウントを連携
4. `visitor-demo` リポジトリを選択
5. 「Import」をクリック

**設定は不要** - SvelteKitプロジェクトは自動検出されます

6. 「Deploy」をクリック

完了！今後は `git push` するだけで自動デプロイされます。

---

## デプロイ後の確認事項

### ✅ 動作確認

1. デプロイされたURLにアクセス
2. ダッシュボードが表示されることを確認
3. 「QRコードを表示」→「テストアクセス」で動作確認
4. リアルタイム更新が動作するか確認

### 📱 QRコード生成

本番環境のURLでQRコードを生成：

- **受付**: `https://YOUR_APP.vercel.app/checkin/reception-001`
- **待合室**: `https://YOUR_APP.vercel.app/checkin/waiting-002`
- **面談室**: `https://YOUR_APP.vercel.app/checkin/meeting-003`
- **完了**: `https://YOUR_APP.vercel.app/checkin/complete-004`

QRコード生成ツール: https://www.qr-code-generator.com/

---

## 💡 本番環境での注意事項

### データの永続化

現在は `localStorage` を使用しているため：
- ✅ デモ用途には最適
- ❌ 複数ユーザー間でのデータ共有は不可
- ❌ ブラウザを閉じるとデータが残る（意図しない場合は問題）

### 本番環境で推奨する構成

複数デバイスでリアルタイムに同期したい場合：

```
SvelteKit (Vercel)
    ↓
Supabase (無料プラン)
    ↓
PostgreSQL + Realtime
```

Supabase導入の利点：
- リアルタイムデータベース同期
- 複数デバイス対応
- データの永続化
- 無料枠で十分運用可能

---

## 🔧 カスタムドメイン設定

Vercel ダッシュボード → Settings → Domains で独自ドメインを設定可能

例: `visitor.your-domain.com`

---

## 📊 アクセス解析

Vercel の Analytics 機能で以下を確認可能：
- ページビュー数
- ユーザー数
- パフォーマンス

Settings → Analytics で有効化

---

## 🆘 トラブルシューティング

### デプロイが失敗する

```bash
# ローカルでビルドテスト
npm run build

# エラーがあれば修正してコミット
git add .
git commit -m "Fix build errors"
git push
```

### 環境変数が必要な場合

Vercel ダッシュボード → Settings → Environment Variables

現在のプロジェクトでは環境変数は不要です。

---

## 📞 サポート

- Vercelドキュメント: https://vercel.com/docs
- SvelteKitドキュメント: https://kit.svelte.dev/docs

---

## 次のステップ

1. ✅ Vercelにデプロイ
2. 📱 QRコードを生成
3. 🧪 実機でテスト
4. 📊 Supabase導入（必要に応じて）
5. 🎨 デザインのカスタマイズ
6. 📈 機能拡張（通知、統計など）

ご質問があればお気軽にお知らせください！
