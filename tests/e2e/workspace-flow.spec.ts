import { test, expect } from "@playwright/test";

test.describe("ワークスペース管理フロー", () => {
  test("ワークスペースを作成できる", async ({ page }) => {
    await page.goto("/");

    // 新規作成ボタンをクリック
    await page.getByRole("button", { name: "新規作成" }).click();

    // モーダルが表示される
    await expect(page.getByRole("heading", { name: "ワークスペースを作成" })).toBeVisible();

    // ワークスペース名を入力
    await page.getByLabel("ワークスペース名").fill("テストワークスペース");

    // 作成ボタンをクリック
    await page.getByRole("button", { name: "作成" }).click();

    // 成功トーストが表示される
    await expect(page.getByText("作成しました")).toBeVisible();
  });

  test("ワークスペース設定画面が表示される", async ({ page }) => {
    await page.goto("/workspaces/1/settings");

    // 設定ページタイトルが表示される
    await expect(page.locator("h1")).toContainText("ワークスペース設定");

    // メンバー管理セクションが表示される
    await expect(page.getByRole("heading", { name: "メンバー管理" })).toBeVisible();

    // 招待リンクセクションが表示される
    await expect(page.getByRole("heading", { name: "招待リンク" })).toBeVisible();

    // 危険な操作セクションが表示される
    await expect(page.getByRole("heading", { name: "危険な操作" })).toBeVisible();
  });

  test("招待リンクを発行できる", async ({ page }) => {
    await page.goto("/workspaces/1/settings");

    // 招待リンクを生成ボタンをクリック
    await page.getByRole("button", { name: "招待リンクを生成" }).click();

    // リンクが表示される
    await expect(page.locator('input[value*="https://wavey.app/invite"]')).toBeVisible();

    // コピーボタンが表示される
    await expect(page.getByRole("button", { name: /コピー/ })).toBeVisible();
  });

  test("メンバー一覧が表示される", async ({ page }) => {
    await page.goto("/workspaces/1/settings");

    // メンバーが表示される（名前のspan要素を特定）
    await expect(page.locator("span.font-medium").filter({ hasText: "自分" })).toBeVisible();
    await expect(page.locator("span.font-medium").filter({ hasText: "田中" })).toBeVisible();

    // オーナーバッジが表示される
    await expect(page.getByText("オーナー", { exact: true })).toBeVisible();
  });

  test("オーナー権限譲渡モーダルが表示される", async ({ page }) => {
    await page.goto("/workspaces/1/settings");

    // オーナー権限を譲渡ボタンをクリック
    await page.getByRole("button", { name: "オーナー権限を譲渡" }).click();

    // モーダルが表示される（exact matchで特定）
    await expect(page.getByText("この操作は取り消せません", { exact: true })).toBeVisible();

    // メンバー選択が表示される
    await expect(page.getByText("譲渡先メンバー")).toBeVisible();

    // キャンセルで閉じる
    await page.getByRole("button", { name: "キャンセル" }).click();
  });

  test("ワークスペース削除モーダルが表示される", async ({ page }) => {
    await page.goto("/workspaces/1/settings");

    // ワークスペースを削除ボタンをクリック
    await page.getByRole("button", { name: "ワークスペースを削除" }).click();

    // 確認モーダルが表示される
    await expect(page.getByText("すべてのデータが削除されます")).toBeVisible();

    // ワークスペース名入力フィールドが表示される
    await expect(page.getByText("確認のためワークスペース名を入力")).toBeVisible();

    // キャンセルで閉じる
    await page.getByRole("button", { name: "キャンセル" }).click();
  });
});
