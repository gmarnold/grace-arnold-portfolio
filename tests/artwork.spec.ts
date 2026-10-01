import { test, expect, type Locator } from '@playwright/test';

async function loaded(image: Locator) {
  await image.scrollIntoViewIfNeeded();
  await expect(image).toHaveAttribute('alt', '');
  await expect
    .poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth))
    .toBe(160);
}

test('all six original illustrations appear as small decorative WebP assets', async ({
  page,
}, testInfo) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => {} } }),
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await page.getByRole('combobox', { name: 'Color theme' }).selectOption('dark');
  await page.locator('.engineering-details summary').click();
  await loaded(page.locator('.illustration-muscle-milcery'));
  await page.locator('.ownership-aside summary').click();
  await loaded(page.locator('.illustration-eldegirlboss'));
  await page.getByRole('button', { name: 'Copy email' }).click();
  await loaded(page.locator('.illustration-toggers'));
  await page.getByRole('button', { name: 'Quick links' }).click();
  await loaded(page.locator('.illustration-calyrex-gamer'));
  await loaded(page.locator('.night-note .illustration-sleepy-espeon'));
  await page.keyboard.press('Escape');
  await page.getByRole('combobox', { name: 'Color theme' }).selectOption('light');
  await page.getByRole('button', { name: 'Quick links' }).click();
  await loaded(page.locator('.night-note .illustration-skitty-hi'));
  await page.screenshot({ path: `.local/${testInfo.project.name}-artwork-palette.png` });
  for (const image of await page.locator('.illustration').all()) {
    await expect(image).toHaveAttribute('src', /\.webp$/);
  }
});
