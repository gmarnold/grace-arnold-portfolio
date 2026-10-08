import { test, expect } from '@playwright/test';

test('the hero types once without moving the heading or introduction', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => {
    document.addEventListener('animationstart', (event) => {
      if (event.animationName === 'hero-type' && event.target instanceof Element) {
        event.target.getAnimations()[0]?.pause();
      }
    });
  });
  await page.goto('./');
  await page.evaluate(() => document.fonts.ready);
  const heading = page.getByRole('heading', { level: 1, name: 'You had me at > Hello World.' });
  await expect(heading).toBeVisible();
  const typed = page.locator('.hero-typed');
  const frames = await typed.evaluate((element) => {
    const animation = element.getAnimations()[0];
    animation.pause();
    const snapshot = (time: number) => {
      animation.currentTime = time;
      const heading = document.querySelector('h1')!.getBoundingClientRect();
      const intro = document.querySelector('.hero-description')!.getBoundingClientRect();
      return {
        clip: getComputedStyle(element).clipPath,
        heading: { x: heading.x, y: heading.y, width: heading.width, height: heading.height },
        intro: { x: intro.x, y: intro.y, width: intro.width, height: intro.height },
      };
    };
    const start = snapshot(0);
    const middle = snapshot(660);
    const end = snapshot(1200);
    const iterations = animation.effect!.getTiming().iterations;
    animation.finish();
    return { start, middle, end, iterations };
  });
  expect(frames.start.clip).toBe('inset(0px 100% 0px 0px)');
  expect(frames.middle.clip).toBe('inset(0px 50% 0px 0px)');
  expect(frames.end.clip).toBe('none');
  expect(frames.iterations).toBe(1);
  expect(frames.start.heading).toEqual(frames.end.heading);
  expect(frames.start.intro).toEqual(frames.end.intro);
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(typed).toHaveCSS('clip-path', 'none');
  await page.evaluate(() => window.scrollTo({ top: 800, behavior: 'instant' }));
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(typed).toHaveCSS('clip-path', 'none');
  await expect(page.locator('.hero-code')).toHaveCSS('font-style', 'normal');
  await expect
    .poll(() =>
      page
        .locator('.hero-code')
        .evaluate((element) => getComputedStyle(element, '::after').opacity),
    )
    .toBe('0');
});

test('reduced motion shows the complete heading immediately', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await expect(
    page.getByRole('heading', { level: 1, name: 'You had me at > Hello World.' }),
  ).toBeVisible();
  await expect(page.locator('.hero-typed')).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.hero-typed')).toHaveCSS('clip-path', 'none');
  expect(
    await page.locator('.hero-code').evaluate((element) => {
      const cursor = getComputedStyle(element, '::after');
      return { animation: cursor.animationName, opacity: cursor.opacity };
    }),
  ).toEqual({ animation: 'none', opacity: '0' });
});
