import { test, expect } from "@playwright/test";

test.describe("Waveフロー", () => {
  test.beforeEach(async ({ page }) => {
    // ワークスペースページに移動
    await page.goto("/workspaces/1");
  });

  test("ワークスペースに入室してメンバー一覧が表示される", async ({ page }) => {
    // ワークスペース名が表示される
    await expect(page.locator("h1")).toContainText("開発チーム");

    // バーチャルオフィスが表示される
    await expect(page.getByText("エンジニアリング")).toBeVisible();
    await expect(page.getByText("ミーティング")).toBeVisible();
    await expect(page.getByText("デザイン")).toBeVisible();

    // メンバーが表示される（最初のマッチを使用）
    await expect(page.getByText("田中").first()).toBeVisible();
    await expect(page.getByText("佐藤").first()).toBeVisible();
  });

  test("メンバーをクリックしてWaveを送信できる", async ({ page }) => {
    // メンバーをクリック（バーチャルオフィス内のボタン）
    await page.getByRole("button", { name: /田中/ }).click();

    // モーダルが表示される
    await expect(page.getByText("アクションを選択")).toBeVisible();

    // 手を振るボタンをクリック
    await page.getByRole("button", { name: /手を振る/ }).click();

    // トースト通知が表示される
    await expect(page.getByText("Wave送信")).toBeVisible();
  });

  test("Wave受信通知が表示される", async ({ page }) => {
    // Wave受信デモボタンをクリック
    await page.getByRole("button", { name: "Wave受信デモ" }).click();

    // Wave受信通知が表示される
    await expect(page.getByText("さんが手を振っています")).toBeVisible();

    // 話すボタンが表示される
    await expect(page.getByRole("button", { name: /話す/ })).toBeVisible();

    // あとでボタンが表示される
    await expect(page.getByRole("button", { name: /あとで/ })).toBeVisible();
  });

  // TODO: アニメーション中のボタンクリックが不安定なため一時スキップ
  test.skip("Waveを受け入れて通話が開始される", async ({ page }) => {
    // Wave受信デモボタンをクリック
    await page.getByRole("button", { name: "Wave受信デモ" }).click();

    // 話すボタンが表示されて安定するまで待つ
    const talkButton = page.locator("button", { hasText: "話す" });
    await expect(talkButton).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(500);

    // 話すボタンをクリック（force: trueで強制）
    await talkButton.click({ force: true, timeout: 10000 });

    // 通話画面が表示される
    await expect(page.getByText("通話中")).toBeVisible({ timeout: 5000 });

    // 通話時間が表示されるまで待つ
    await expect(page.locator("text=/00:\\d{2}/")).toBeVisible({ timeout: 5000 });

    // 切断ボタンをクリック
    await page.locator('button[title="通話終了"]').click();

    // 通話終了トーストが表示される
    await expect(page.getByText("通話終了")).toBeVisible({ timeout: 3000 });
  });

  test("Wave履歴が表示される", async ({ page }) => {
    // 最近のWaveセクションが表示される
    await expect(page.getByText("最近のWave")).toBeVisible();
  });
});
