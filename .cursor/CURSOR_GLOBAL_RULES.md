# Cursor グローバルルール（正本）

**このファイルが Cursor 全体の方針の単一の正本。**  
Cursor の **Settings → Rules for AI（ユーザールール）** には長文を貼らず、末尾の **「設定に貼る短い文」** だけを貼る。

---

## 1. 言語・応答

- ユーザーへの説明は **日本語**。
- コード引用は ```startLine:endLine:path``` 形式を優先する。
- 専門用語には短い補足を付ける（相手が非エンジニアのとき）。

## 2. CLI・作業の進め方

- ターミナルで済むことは **ユーザーに丸投げせずエージェントが実行**する。
- 開発のフェーズ進行は **チャット上で**行う（可能な範囲）。

## 3. 秘密情報

- トークン・鍵・本番秘密は **リポジトリに書かない**。本番は Secret Manager、ローカルは `.env`（コミット禁止）など、案件のルールに従う。

## 4. 開発ゲート（計画承認後）

1. 設計 → 2. テスト実装 → 3. プロダクト実装 → 4. 静的チェック → 5. 自動テスト  

その後:

6. **ローカルレビュー最低 3 ラウンド**。各ラウンド **4 並列**（アプリ / セキュリティ / QA / アーキ）。サブエージェントや別モデル可。
7. 軽微すぎない指摘は **すべて対応** → 対応後は **レビュー回数リセット**し、**再度 3 ラウンド**（ゼロになるまで）。
8. **E2E** → 問題なければ **PR**。問題あれば **静的チェックからやり直し**、レビュー回数もリセット。

### チャット合図

| 合図 | 意味 |
|------|------|
| `計画承認` | 設計・実装フェーズへ |
| `実装完了` | 設計〜自動テストまで終了。以降は静的から |
| `静的OK` | lint / typecheck 等クリア |
| `レビュー回開始` | 4 並列レビュー 1 ラウンド |
| `レビュー全クリア` | 当該ラウンド指摘ゼロ |
| `E2E実行` | ブラウザ E2E |
| `PR作成` | 差分説明付き PR |

### PR 説明

計画時との差分、指摘への対応、対応不要と判断した点と理由を含める。

### マージ

レビュー観点が揃ったものとして扱い、**コードはほぼ見ずにマージ可**とする前提。残課題は Issue 化など。

---

## 5. レビュー用スキル（個人用・全プロジェクト）

正本ディレクトリ: `~/.cursor/skills/review-*`（フォルダ単位で実体あり）。

並列レビューや該当変更があるとき、次を **必要に応じて `Read`** する。

| 観点 | パス（この Mac） |
|------|-------------------|
| アプリ・プロダクト | `~/.cursor/skills/review-app-product/SKILL.md` |
| セキュリティ | `~/.cursor/skills/review-security/SKILL.md` |
| QA | `~/.cursor/skills/review-qa/SKILL.md` |
| アーキテクチャ | `~/.cursor/skills/review-architecture/SKILL.md` |
| フロント（該当時） | `~/.cursor/skills/review-frontend/SKILL.md` |
| バックエンド（該当時） | `~/.cursor/skills/review-backend/SKILL.md` |
| インフラ・CI（該当時） | `~/.cursor/skills/review-infra/SKILL.md` |
| テスト（該当時） | `~/.cursor/skills/review-test/SKILL.md` |

各ラウンドでコア 4 つ（app-product / security / qa / architecture）の SKILL は **レビュー前に Read**。変更種別に応じて FE/BE/infra/test も Read。

### プロダクト UI/UX 設計（コード前・全PJ）

- アプリ・ダッシュボード・ツール画面の **体験・IA・状態・視覚方針** を決めるとき: **`~/.cursor/skills/product-ui-ux-design/SKILL.md`** を Read。
- 設計だけ Subagent に渡す: **`~/.cursor/agents/product-ui-ux-designer.md`**（成果物は通常 **`docs/ux-design/`**）。
- **LP・コーポ・ランディング** は従来どおり **`site-build-orchestrator`**（`docs/site`）を使う。

### フロントエンド実装の順序（UI/UX・顧客ファースト先行・全PJ）

**内部構造（フォルダ・状態管理・API の割り当て）より前に、ユーザー向けの体験と画面の契約を固定する。**

1. **必ず先に**: **`~/.cursor/skills/user-first-product-design/SKILL.md`**（出発点）→ 案件に応じ **`product-ui-ux-design`** または **`site-build-orchestrator`**、Figma 系、`design-md-reference`（`DESIGN.md` があるとき）。必要なら **`/product-ui-ux-designer`** や **`/site-design-planner`** を先に Task する。
2. **その後**: コンポーネント分割、ディレクトリ構成、データ取得の詳細。  
「コンポーネントから入る」「アーキだけ先に決める」で UI を後付けしない。

詳細な表と Subagent 名は **`~/.cursor/rules/global-agent-workflow.mdc`** の「フロントエンド実装の順序」を参照。

### DESIGN.md・VoltAgent awesome-design-md（全PJ）

Google Stitch 互換の **`DESIGN.md`** をトークン／トーンの契約に使うとき（Figma の代替や併用含む）:

- **手順スキル（必読）**: **`~/.cursor/skills/design-md-reference/SKILL.md`**
- **プリセット収集の Git 正本**: **`https://github.com/VoltAgent/awesome-design-md.git`**
- エージェントは **上記スキルを Read してから**、選んだサイトの **`DESIGN.md`**（必要なら `preview.html` / `preview-dark.html`）を **作業リポにコピーしたパス**またはローカル clone 上のパスで `Read` し、実装へ写す。**プリセットだけ決めてスキルを飛ばさない。**

`global-agent-workflow.mdc` の技能表にも同趣旨の行がある。

---

## 6. Superpowers

- プラグイン `/add-plugin superpowers` でスキルが使える。
- リポジトリに `.cursor/superpowers` を置いている場合は、そのリポの `.cursor/rules` も参照。
- 作業内容に合う Superpowers スキルがあるときは、**実装・計画の前に** 該当 `SKILL.md` を `Read` する。

---

## 7. プロジェクト固有のルール

GCP の手順、ディレクトリ規約、スタック固有の禁止事項などは **各リポジトリの `.cursor/rules` や `AGENTS.md`** に書く。グローバル正本と矛盾する場合は **ユーザーの明示指示** を最優先し、次に **リポジトリのルール**。

---

## 設定に貼る短い文（Cursor → Rules for AI）

以下を **そのまま** ユーザールール欄に **1 ブロックだけ** 貼る（長文は貼らない）。

```
開発方針・レビュー手順・スキルパスは ~/.cursor/CURSOR_GLOBAL_RULES.md にある。該当する作業（レビュー・ゲート進行・Superpowers 利用など）に入る前に、そのファイルの該当節を Read して従うこと。

常時: ユーザーへの返答は日本語。CLI で実行できる作業はユーザーに任せずエージェントが行う。秘密情報をリポに書かない。
```

（ホームディレクトリの `~` が展開されない場合は絶対パス `~/.cursor/CURSOR_GLOBAL_RULES.md` に置き換えてよい。）
