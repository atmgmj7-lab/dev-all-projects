const { chromium } = require('playwright');

const TARGET_URL = 'http://localhost:3000';

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 150 });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1600, height: 900 });

  // コンソールエラーを収集
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('response', async resp => {
    if (resp.url().includes('/api/agents')) {
      const text = await resp.text().catch(() => '');
      console.log(`API: ${resp.url()} → ${resp.status()} → ${text.substring(0, 200)}`);
    }
  });

  await page.goto(`${TARGET_URL}/list-analysis`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // ── 確認1: 全履歴モード ──────────────────────────────────
  console.log('\n=== 確認1: 全履歴モード ===');

  // 「全員▼」ボタンをクリックしてドロップダウンを開く
  const dropdownBtn = page.locator('button', { hasText: /全員▼|全員 ▼/ }).first();
  await dropdownBtn.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: '/tmp/01-all-dropdown-open.png' });

  const checkboxLabels = await page.locator('label').filter({ has: page.locator('input[type="checkbox"]') }).all();
  const allModeAgents = [];
  for (const label of checkboxLabels) {
    const text = (await label.textContent())?.trim().replace(/^\s*\S+\s*/, '').trim(); // チェックボックス後のテキスト
    const fullText = (await label.textContent())?.trim();
    if (fullText) allModeAgents.push(fullText);
  }
  console.log(`全履歴モード 担当者数: ${allModeAgents.length}名`);
  allModeAgents.forEach((n, i) => console.log(`  ${i+1}. ${n}`));

  // ドロップダウンを閉じる
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // ── 確認2: 現役のみモード ──────────────────────────────────
  console.log('\n=== 確認2: 現役のみモード ===');
  await page.locator('button', { hasText: '現役のみ' }).click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '/tmp/02-active-mode.png' });

  // ドロップダウンを開く（現役のみ後）
  const dropdownBtn2 = page.locator('button').filter({ hasText: /▼/ }).first();
  await dropdownBtn2.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: '/tmp/03-active-dropdown.png' });

  const activeLabels = await page.locator('label').filter({ has: page.locator('input[type="checkbox"]') }).all();
  const activeModeAgents = [];
  for (const label of activeLabels) {
    const text = (await label.textContent())?.trim();
    if (text) activeModeAgents.push(text);
  }
  console.log(`現役のみモード 担当者数: ${activeModeAgents.length}名`);
  activeModeAgents.forEach((n, i) => console.log(`  ${i+1}. ${n}`));

  // /api/agents/active のレスポンスを直接確認
  const activeResp = await page.request.get(`${TARGET_URL}/api/agents/active`);
  const activeData = await activeResp.json();
  console.log(`\n/api/agents/active レスポンス (status=${activeResp.status()}):`, JSON.stringify(activeData));

  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // ── 確認3: 全履歴に戻して絞込→ピボット ──────────────────────
  console.log('\n=== 確認3: 全履歴→絞込→ピボット ===');
  await page.locator('button', { hasText: '全履歴' }).click();
  await page.waitForTimeout(1000);

  // 絞込（フィルターなし）
  await page.locator('button', { hasText: '絞込' }).click();
  await page.waitForTimeout(3000);

  // ピボット表示
  await page.locator('button', { hasText: 'ピボット' }).click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/04-pivot.png', fullPage: true });

  // ピボットの担当者列（th）を取得
  const pivotHeaders = await page.locator('table thead th').all();
  const headerTexts = [];
  for (const th of pivotHeaders) {
    const t = (await th.textContent())?.trim();
    if (t) headerTexts.push(t);
  }
  console.log(`ピボット列ヘッダー (${headerTexts.length}列): ${headerTexts.slice(0, 15).join(' | ')}`);

  // ピボット行数
  const rowCount = await page.locator('table tbody tr').count();
  console.log(`ピボット行数: ${rowCount}`);

  // コンソールエラー
  if (consoleErrors.length > 0) {
    console.log(`\nコンソールエラー: ${consoleErrors.length}件`);
    consoleErrors.forEach(e => console.log('  ❌', e.substring(0, 100)));
  }

  console.log('\n=== テスト完了 ===');
  await page.waitForTimeout(2000);
  await browser.close();
})();
