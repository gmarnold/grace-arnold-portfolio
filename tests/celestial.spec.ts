import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { calculateSky } from '../src/features/astronomy';
import { chicago } from '../src/features/weather';

test('constellations retain contrast and their floor through bright moons and weather', async ({
  page,
}, info) => {
  for (const [weather, phase] of [
    ['clear', 'new'],
    ['clear', 'full'],
    ['overcast', 'crescent'],
    ['overcast', 'gibbous'],
    ['storm', 'full'],
  ]) {
    await page.goto(
      `./?atmosphere=${weather}&theme=dark&time=night&moonPhase=${phase}&skyDate=2026-10-01T04:00:00Z&motion=freeze`,
    );
    const art = page.locator('.constellation-layer');
    await expect(art).toBeVisible();
    const styles = await art.evaluate((el) => {
      const css = getComputedStyle(el);
      return {
        opacity: Number(css.opacity),
        stroke: css.stroke,
        weight: parseFloat(css.strokeWidth),
        z: Number(css.zIndex),
      };
    });
    expect(styles.opacity).toBeGreaterThanOrEqual(0.74);
    expect(styles.stroke).toBe('rgb(227, 214, 239)');
    expect(styles.weight).toBeGreaterThanOrEqual(1.25);
    expect(styles.z).toBeGreaterThan(
      Number(await page.locator('.cloud-layer').evaluate((el) => getComputedStyle(el).zIndex)),
    );
    await page.screenshot({
      path: `.local/celestial-${info.project.name}-${weather}-${phase}.png`,
    });
  }
});

test('particle motion differs by preset, freezes reproducibly, and respects reduced motion', async ({
  page,
}) => {
  for (const [preset, animation] of [
    ['drizzle', 'particle-fall'],
    ['rain', 'particle-fall'],
    ['heavy-rain', 'particle-fall'],
    ['snow', 'flurry-fall'],
    ['heavy-snow', 'flurry-fall'],
    ['freezing', 'ice-fall'],
    ['hail', 'ice-fall'],
    ['storm', 'particle-fall'],
  ]) {
    await page.goto(`./?atmosphere=${preset}&theme=dark&motion=freeze`);
    const particles = page.locator('.weather-particle');
    await expect(particles.first()).toBeAttached();
    const particle =
      preset === 'freezing' ? page.locator('.particle-ice').first() : particles.first();
    await expect(particle).toHaveCSS('animation-name', animation);
    await expect(particle).toHaveCSS('animation-play-state', 'paused');
    const values = await particles.evaluateAll((els) => els.map((el) => el.getAttribute('style')));
    expect(new Set(values).size).toBe(values.length);
    expect(values.every((value) => value && !/NaN|Infinity/.test(value))).toBe(true);
    await page.reload();
    await expect(particles.first()).toBeAttached();
    expect(await particles.evaluateAll((els) => els.map((el) => el.getAttribute('style')))).toEqual(
      values,
    );
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.weather-particle').first()).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.cloud-layer span').first()).toHaveCSS('animation-name', 'none');
});

test('panel explains the same actual current/tonight sky, stays accessible, and restores focus', async ({
  page,
}) => {
  for (const date of ['2026-10-01T18:00:00Z', '2026-10-01T04:00:00Z']) {
    await page.goto(`./?atmosphere=overcast&theme=dark&skyDate=${date}`);
    const opener = page.locator('.hero-weather button');
    await opener.focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'Tonight over Chicago' })).toBeVisible();
    const sky = calculateSky(chicago, new Date(date));
    for (const object of sky.tonight.planets)
      await expect(dialog.getByText(object.name, { exact: true }).first()).toBeVisible();
    await expect(
      dialog.getByText(sky.tonight.constellations.map((c) => c.name).join(' · '), { exact: true }),
    ).toBeVisible();
    await expect(dialog.getByRole('heading', { name: sky.phase, exact: true })).toBeVisible();
    await expect(
      dialog.getByText(date.includes('18:00') ? /Coming evening, 30 minutes/ : /Current night sky/),
    ).toBeVisible();
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
        .violations,
    ).toEqual([]);
    await page.keyboard.press('Escape');
    await expect(opener).toBeFocused();
  }
});

test('astronomy failure retains atmosphere without inventing panel facts', async ({ page }) => {
  await page.route('**/heroSky-*.js', (route) => route.abort());
  await page.goto('./?atmosphere=storm&theme=dark');
  await page.locator('.hero-weather button').click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByText(/Sky calculations are unavailable/)).toBeVisible();
  await expect(dialog.getByRole('heading', { name: 'Tonight over Chicago' })).toHaveCount(0);
  await expect(page.locator('.sky-gradient')).toBeAttached();
  await page.keyboard.press('Escape');
  await page.getByRole('link', { name: 'Explore my work' }).click();
  await expect(page).toHaveURL(/#work$/);
});

test('header/footer signatures follow system theme with identical decorative footprints', async ({
  page,
}) => {
  await page.goto('./?atmosphere=clear');
  await page.getByLabel('Color theme').selectOption('system');
  await page.emulateMedia({ colorScheme: 'light' });
  const marks = page.locator('.brand-mark');
  await expect(marks).toHaveCount(2);
  const boxes = await Promise.all((await marks.all()).map((mark) => mark.boundingBox()));
  await expect(marks.first().locator('.brand-light')).toBeVisible();
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(marks.first().locator('.brand-dark')).toBeVisible();
  expect(await Promise.all((await marks.all()).map((mark) => mark.boundingBox()))).toEqual(boxes);
  for (const mark of await marks.all()) {
    await expect(mark).toHaveAttribute('aria-hidden', 'true');
    await expect(mark).toHaveCSS('pointer-events', 'none');
    for (const img of await mark.locator('img').all()) await expect(img).toHaveAttribute('alt', '');
  }
});
