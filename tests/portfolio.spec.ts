import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { PDFDocument } from 'pdf-lib';

test('read a case study, reach contact, and download the resume', async ({ page, isMobile }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('./');
  await page.getByRole('link', { name: 'Explore my work' }).click();
  await expect(page).toHaveURL(/#work$/);
  const starBaker = page
    .locator('details')
    .filter({ has: page.getByText('Explore the work: Star Baker') });
  await starBaker.locator('summary').click();
  await expect(starBaker.getByRole('heading', { name: 'Decisions & debugging' })).toBeVisible();
  await expect(starBaker.getByRole('link', { name: 'Read the source' })).toHaveAttribute(
    'href',
    /github.com\/gmarnold\/Unity-Create-with-Code/,
  );
  if (isMobile) {
    await page.getByRole('button', { name: 'Menu' }).click();
  }
  await page.getByRole('navigation').getByRole('link', { name: 'Contact', exact: true }).click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.getByRole('link', { name: 'grace.m.arnold@outlook.com' })).toHaveAttribute(
    'href',
    'mailto:grace.m.arnold@outlook.com',
  );
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download résumé' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('grace-arnold-resume.pdf');
  const pdfResponse = await page.request.get('grace-arnold-resume.pdf');
  expect(pdfResponse.ok()).toBeTruthy();
  expect((await PDFDocument.load(await pdfResponse.body())).getPageCount()).toBe(1);
  expect(errors).toEqual([]);
});

test('keyboard access, reduced motion, and accessibility', async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  const summary = page.locator('summary').first();
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('details').first()).toHaveAttribute('open', '');
  await page.keyboard.press('Enter');
  await expect(page.locator('details').first()).not.toHaveAttribute('open');
  if (isMobile) {
    const menu = page.getByRole('button', { name: 'Menu' });
    await menu.click();
    await page.getByRole('navigation').getByRole('link', { name: 'Work', exact: true }).focus();
    await page.keyboard.press('Escape');
    await expect(menu).toBeFocused();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
  }
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe(
    'auto',
  );
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
      .violations,
  ).toEqual([]);
});

test('all local assets load without overflow and hash refresh works', async ({
  page,
}, testInfo) => {
  const failed: string[] = [];
  page.on('response', (response) => {
    if (response.status() >= 400) failed.push(response.url());
  });
  await page.goto('./#work');
  await page.reload();
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const image = page.getByRole('img', { name: /Star Baker/ });
  await image.scrollIntoViewIfNeeded();
  expect(
    await image.evaluate((element) => (element as HTMLImageElement).naturalWidth),
  ).toBeGreaterThan(0);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBeTruthy();
  }
  await page.setViewportSize(
    testInfo.project.name === 'mobile'
      ? { width: 390, height: 844 }
      : { width: 1440, height: 1000 },
  );
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: `.local/${testInfo.project.name}.png`, fullPage: true });
  expect(failed).toEqual([]);
});

test('production content remains readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/grace-arnold-portfolio/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.locator('summary').nth(1).click();
  await expect(page.getByRole('heading', { name: 'The idea' })).toBeVisible();
  await context.close();
});
