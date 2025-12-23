import { test, expect } from "@playwright/test";

test.describe("認証フロー", () => {
  test("ログイン画面が表示される", async ({ page }) => {
    await page.goto("/login");

    // タイトル確認
    await expect(page.locator("h1")).toContainText("ログイン");

    // メール入力フィールドが存在
    await expect(page.locator('input[type="email"]')).toBeVisible();

    // 送信ボタンが存在
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("メール入力して送信できる", async ({ page }) => {
    await page.goto("/login");

    // メールアドレス入力
    await page.fill('input[type="email"]', "test@example.com");

    // 送信ボタンクリック
    await page.click('button[type="submit"]');

    // 送信完了メッセージが表示される
    await expect(page.locator("text=メールを送信しました")).toBeVisible();
  });

  test("プロフィール設定画面が表示される", async ({ page }) => {
    await page.goto("/profile/setup");

    // タイトル確認
    await expect(page.locator("h1")).toContainText("プロフィール設定");

    // ニックネーム入力フィールドが存在（labelで特定）
    await expect(page.getByLabel("ニックネーム")).toBeVisible();

    // スキン選択が存在
    await expect(page.getByText("スキンを選択")).toBeVisible();
  });

  test("プロフィール設定を保存できる", async ({ page }) => {
    await page.goto("/profile/setup");

    // ニックネーム入力
    await page.getByLabel("ニックネーム").fill("テストユーザー");

    // スキン選択（最初のスキンをクリック）
    await page.locator('[data-testid="skin-option"]').first().click();

    // 保存ボタンクリック
    await page.click('button[type="submit"]');

    // ダッシュボードにリダイレクト
    await expect(page).toHaveURL("/");
  });

  test("ダッシュボードが表示される", async ({ page }) => {
    await page.goto("/");

    // ワークスペース一覧が表示される
    await expect(page.getByRole("heading", { name: "ワークスペース" })).toBeVisible();
  });
});
