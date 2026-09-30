import { test, expect } from '@playwright/test';

test('a failed sky bundle is isolated from portfolio navigation', async ({ page }) => {
  await page.route('**/assets/SkyExperience-*.js', (route) => route.abort());
  await page.goto('./');
  await page.getByRole('button', { name: 'Tonight’s sky' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('status')).toContainText('The sky feature couldn’t load');
  await dialog.getByRole('button', { name: 'Close Tonight’s sky' }).click();
  await page.getByRole('link', { name: 'Explore my work' }).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('moving from the palette into the sky keeps focus in the modal and returns it on close', async ({
  page,
}) => {
  await page.route('https://api.open-meteo.com/**', (route) =>
    route.fulfill({
      json: { current: { weather_code: 3, is_day: 1 }, timezone: 'America/Chicago' },
    }),
  );
  await page.goto('./');
  const opener = page.getByRole('button', { name: 'Quick links' });
  await opener.click();
  await page.getByRole('combobox', { name: 'Search commands' }).fill('sky');
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Tonight’s sky' });
  await expect(dialog.getByRole('button', { name: 'Close Tonight’s sky' })).toBeFocused();
  await expect(dialog.getByText('Next sunset', { exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(opener).toBeFocused();
});
