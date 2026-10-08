import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const weatherResponse = { current: { weather_code: 0, is_day: 0 }, timezone: 'America/Chicago' };

test('system theme responds to OS changes; explicit overrides persist', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('./');
  const theme = page.getByRole('combobox', { name: 'Color theme' });
  await expect(theme).toHaveValue('system');
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(40, 31, 44)');
  await theme.selectOption('light');
  await page.reload();
  await expect(theme).toHaveValue('light');
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(250, 245, 247)');
  await theme.selectOption('dark');
  await page.reload();
  await expect(theme).toHaveValue('dark');
  await theme.selectOption('system');
  expect(await page.evaluate(() => localStorage.getItem('grace-portfolio-theme'))).toBeNull();
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(250, 245, 247)');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(40, 31, 44)');
});

test('keyboard palette searches, navigates, traps focus and restores its opener', async ({
  page,
}) => {
  await page.goto('./');
  const opener = page.getByRole('button', { name: 'Quick links' });
  await opener.click();
  const dialog = page.getByRole('dialog', { name: 'Quick links' });
  const search = dialog.getByRole('combobox', { name: 'Search commands' });
  await expect(search).toBeFocused();
  await search.fill('no such thing');
  await expect(dialog.getByRole('status')).toContainText('No matching');
  await search.fill('theme');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect(dialog.getByRole('option', { name: 'Theme: Dark' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await page.keyboard.press('Enter');
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
  await expect(page.getByRole('combobox', { name: 'Color theme' })).toHaveValue('dark');
  await page.keyboard.press('Control+k');
  await search.fill('');
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  }
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('Shift+Tab');
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(opener).toBeFocused();
  await page.keyboard.press('Meta+k');
  await search.fill('engineering');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#engineering$/);
  await expect(page.locator('#engineering details')).toHaveAttribute('open', '');
});

test('light and dark expanded content and palette meet axe checks', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  for (const theme of ['light', 'dark']) {
    await page.getByRole('combobox', { name: 'Color theme' }).selectOption(theme);
    await page
      .locator('.engineering-details')
      .evaluate((element) => element.setAttribute('open', ''));
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
        .violations,
    ).toEqual([]);
    await page.getByRole('button', { name: 'Quick links' }).click();
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
        .violations,
    ).toEqual([]);
    await page.keyboard.press('Escape');
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: `.local/${testInfo.project.name}-dark.png`, fullPage: true });
});

test('Chicago weather loads automatically; details stay lazy, cached and motion-safe', async ({
  page,
}, testInfo) => {
  let requests = 0;
  const scripts: string[] = [];
  page.on('request', (request) => {
    if (request.resourceType() === 'script') scripts.push(request.url());
  });
  await page.route('https://api.open-meteo.com/**', (route) => {
    requests++;
    return route.fulfill({ json: weatherResponse });
  });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition() {
          throw new Error('Unexpected geolocation request');
        },
      },
    });
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await expect.poll(() => requests).toBe(1);
  expect(scripts.some((url) => url.includes('SkyExperience'))).toBe(false);
  await page.getByRole('button', { name: 'Tonight’s sky' }).click();
  const dialog = page.getByRole('dialog', { name: 'Tonight’s sky' });
  await expect(dialog.getByText('Clear', { exact: true })).toBeVisible();
  await expect(dialog.getByText('Next sunrise', { exact: true })).toBeVisible();
  expect(requests).toBe(1);
  await expect(dialog.getByRole('checkbox', { name: 'Show atmosphere' })).toBeChecked();
  await expect(page.locator('.hero-atmosphere')).toHaveAttribute('data-preset', 'clear');
  expect(
    await page
      .locator('.hero')
      .evaluate((element) => getComputedStyle(element, '::before').animationName),
  ).toBe('none');
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
      .violations,
  ).toEqual([]);
  await page.screenshot({ path: `.local/${testInfo.project.name}-sky.png` });
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Tonight’s sky' })).toBeFocused();
  await page.getByRole('button', { name: 'Tonight’s sky' }).click();
  await expect(dialog.getByText('Clear', { exact: true })).toBeVisible();
  expect(requests).toBe(1);
});

test('weather and geolocation failures preserve a usable portfolio and sky calculations', async ({
  page,
}) => {
  await page.route('https://api.open-meteo.com/**', (route) =>
    route.fulfill({ status: 503, body: 'Unavailable' }),
  );
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition(_success: unknown, failure: (error: { code: number }) => void) {
          failure({ code: 1 });
        },
      },
    }),
  );
  await page.goto('./');
  await page.getByRole('button', { name: 'Tonight’s sky' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByText('Time-of-day fallback', { exact: true })).toBeVisible();
  await dialog.getByRole('button', { name: 'Use my local sky' }).click();
  await expect(dialog.locator('.sky-status')).toContainText('permission was declined');
  await expect(dialog.getByText('Next sunrise', { exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('link', { name: 'Explore my work' }).click();
  await expect(page).toHaveURL(/#work$/);
});

test('permitted location is rounded, reused for sky, and never persisted', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ latitude: 38.627, longitude: -90.1994 });
  const requests: string[] = [];
  await page.route('https://api.open-meteo.com/**', (route) => {
    requests.push(route.request().url());
    return route.fulfill({ json: weatherResponse });
  });
  await page.goto('./');
  await page.getByRole('button', { name: 'Tonight’s sky' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Use my local sky' }).click();
  await expect(dialog.getByText('Atmosphere · Your area', { exact: true })).toBeVisible();
  expect(
    requests.some((url) => url.includes('latitude=38.6') && url.includes('longitude=-90.2')),
  ).toBe(true);
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
  await expect(dialog.getByText('Next moonrise', { exact: true })).toBeVisible();
  await dialog.getByRole('button', { name: 'Use Chicago' }).click();
  await expect(dialog.getByText('Atmosphere · Chicago', { exact: true })).toBeVisible();
});

test('no-JavaScript dark fallback and blocked storage leave content readable', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false, colorScheme: 'dark' });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/grace-arnold-portfolio/');
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(40, 31, 44)');
  await page.locator('.engineering-details summary').click();
  await expect(page.getByText('Readable first. Interactive when useful.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Quick links' })).not.toBeVisible();
  await context.close();
  const enabled = await browser.newContext();
  const interactive = await enabled.newPage();
  await interactive.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('Storage denied');
      },
    });
  });
  await interactive.goto('http://127.0.0.1:4173/grace-arnold-portfolio/');
  await interactive.getByRole('combobox', { name: 'Color theme' }).selectOption('dark');
  await expect(interactive.locator('html')).toHaveCSS('background-color', 'rgb(40, 31, 44)');
  await enabled.close();
});

test('clipboard success is announced without replacing the email link', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => {} } }),
  );
  await page.goto('./');
  await page.getByRole('button', { name: 'Copy email' }).click();
  await expect(page.getByRole('status')).toHaveText('Email copied.');
  await expect(page.getByRole('link', { name: 'grace.m.arnold@outlook.com' })).toHaveAttribute(
    'href',
    'mailto:grace.m.arnold@outlook.com',
  );
});
