import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { presets } from '../src/features/atmosphere';

test('every preset supports Sun/day and Moon/night without a weather request or saved overrides', async ({
  page,
}, info) => {
  test.setTimeout(90000);
  let requests = 0;
  await page.route('https://api.open-meteo.com/**', (route) => {
    requests++;
    return route.abort();
  });
  await page.addInitScript(() => localStorage.setItem('grace-portfolio-theme', 'system'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const preset of presets)
    for (const theme of ['light', 'dark']) {
      const time = theme === 'light' ? 'day' : 'night';
      await page.goto(`./?atmosphere=${preset}&time=${time}&theme=${theme}&moonPhase=crescent`);
      const scene = page.locator('.hero-atmosphere');
      await expect(scene).toHaveAttribute('data-preset', preset);
      await expect(scene).toHaveAttribute('data-time', time);
      await expect(page.locator('.celestial-body')).toHaveAttribute(
        'data-body',
        theme === 'light' ? 'sun' : 'moon',
      );
      if (theme === 'dark')
        await expect(page.locator('.hero-moon')).toHaveAttribute('data-phase', 'crescent');
      await expect(page.locator('.hero-weather')).toContainText('Preview');
      await expect(scene).toHaveAttribute('aria-hidden', 'true');
      await expect(scene).toHaveCSS('pointer-events', 'none');
      await expect(page.locator('.precipitation-layer')).toHaveCSS('animation-name', 'none');
      const layers = await page
        .locator('.hero-atmosphere')
        .evaluate((el) =>
          [
            '.sky-gradient',
            '.celestial-body',
            '.cloud-layer',
            '.precipitation-layer',
            '.sky-readability',
          ].map((selector) => Number(getComputedStyle(el.querySelector(selector)!).zIndex)),
        );
      expect(layers).toEqual([0, 2, 1, 4, 5]);
      if (preset === 'clear') await expect(page.locator('.cloud-layer')).toHaveCSS('opacity', '0');
      else
        expect(
          Number(await page.locator('.cloud-layer').evaluate((el) => getComputedStyle(el).opacity)),
        ).toBeGreaterThan(0);
      if (['clear', 'partly-cloudy', 'rain', 'snow', 'storm'].includes(preset))
        await page.screenshot({
          path: `.local/atmosphere-${info.project.name}-${preset}-${theme}.png`,
        });
    }
  expect(requests).toBe(0);
  expect(await page.evaluate(() => localStorage.getItem('grace-portfolio-theme'))).toBe('system');
  await page.getByLabel('Color theme').selectOption('light');
  expect(await page.evaluate(() => localStorage.getItem('grace-portfolio-theme'))).toBe('system');
});

test('all phase overrides render and ordinary URLs ignore them', async ({ page }) => {
  for (const phase of ['new', 'crescent', 'quarter', 'gibbous', 'full']) {
    await page.goto(`./?atmosphere=clear&theme=dark&moonPhase=${phase}`);
    await expect(page.locator('.hero-moon')).toHaveAttribute('data-phase', phase);
    await expect(page.locator('.hero-moon .moon-light')).toHaveCount(phase === 'new' ? 0 : 1);
  }
  await page.clock.install({ time: new Date('2024-04-08T18:21:00Z') });
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('./?moonPhase=full');
  await expect(page.locator('.hero-moon')).toHaveAttribute('data-phase', 'new');
  await expect(page.locator('.hero-atmosphere')).toHaveAttribute('data-preview', 'false');
});

test('system theme changes celestial body and matched artwork without shifting its footprint', async ({
  page,
}) => {
  await page.goto('./?atmosphere=partly-cloudy');
  await page.getByLabel('Color theme').selectOption('system');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('.celestial-body')).toHaveAttribute('data-body', 'sun');
  await page.getByRole('button', { name: 'Quick links' }).click();
  const art = page.locator('.night-note img');
  await expect(art).toHaveClass(/skitty-hi/);
  const footprint = await art.boundingBox();
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(art).toHaveClass(/sleepy-espeon/);
  expect(await art.boundingBox()).toEqual(footprint);
  await expect(page.locator('.celestial-body')).toHaveAttribute('data-body', 'moon');
  await expect(page.locator('#contact .illustration-skitty-hi')).toHaveCount(0);
});

test('automatic weather is real-data driven, failures are honest, and core content survives astronomy failure', async ({
  page,
}) => {
  await page.route('https://api.open-meteo.com/**', (route) =>
    route.fulfill({
      json: {
        current: { weather_code: 63, is_day: 1, temperature_2m: 58 },
        timezone: 'America/Chicago',
      },
    }),
  );
  await page.goto('./');
  await expect(page.locator('.hero-weather')).toContainText('Chicago · Rain · 58°F');
  await expect(page.locator('.hero-atmosphere')).toHaveAttribute('data-preset', 'rain');
  await page.unroute('https://api.open-meteo.com/**');
  await page.route('https://api.open-meteo.com/**', (route) =>
    route.fulfill({ status: 503, body: 'unavailable' }),
  );
  await page.route('**/heroSky-*.js', (route) => route.abort());
  await page.goto('./');
  await expect(page.locator('.hero-weather')).toContainText('Weather unavailable');
  await expect(page.locator('.hero-weather')).not.toContainText('58°F');
  await page.getByRole('link', { name: 'Explore my work' }).click();
  await expect(page).toHaveURL(/#work$/);
});

test('composition stays readable, accessible and within narrow through wide viewports', async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const theme of ['light', 'dark']) {
    await page.goto(`./?atmosphere=storm&theme=${theme}&time=night`);
    await expect(page.locator('.constellation-layer')).toBeAttached();
    for (const width of [320, 390, 768, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      const body = await page.locator('.celestial-body').boundingBox();
      const heading = await page.locator('h1').boundingBox();
      const kicker = await page.locator('.hero-kicker').boundingBox();
      expect(
        body && kicker && (body.x >= kicker.x + kicker.width || body.y + body.height <= kicker.y),
      ).toBeTruthy();
      expect(
        body &&
          heading &&
          (body.x >= heading.x + heading.width ||
            body.y + body.height <= heading.y ||
            body.x + body.width <= heading.x),
      ).toBeTruthy();
    }
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
        .violations,
    ).toEqual([]);
  }
});

test('weather refreshes at cache expiry and never presents an expired observation as current', async ({
  page,
}) => {
  let requests = 0;
  await page.clock.install();
  await page.route('https://api.open-meteo.com/**', (route) => {
    requests++;
    return requests === 1
      ? route.fulfill({
          json: {
            current: { weather_code: 0, is_day: 1, temperature_2m: 58 },
            timezone: 'America/Chicago',
          },
        })
      : route.fulfill({ status: 503, body: 'offline' });
  });
  await page.goto('./');
  await expect(page.locator('.hero-weather')).toContainText('58°F');
  await page.clock.fastForward(14 * 60 * 1000);
  expect(requests).toBe(1);
  await page.clock.fastForward(2 * 60 * 1000);
  await expect(page.locator('.hero-weather')).toContainText('Weather unavailable');
  expect(requests).toBe(2);
  await expect(page.locator('.hero-weather')).not.toContainText('58°F');
  await page.locator('.hero-weather button').click();
  await expect(
    page.getByRole('dialog').getByText('Time-of-day fallback', { exact: true }),
  ).toBeVisible();
  expect(requests).toBe(2);
});
