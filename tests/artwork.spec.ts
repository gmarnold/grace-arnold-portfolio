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
  await loaded(page.locator('#about .illustration-muscle-milcery'));
  await loaded(page.locator('#experience .illustration-eldegirlboss'));
  await page.getByRole('button', { name: 'Copy email' }).click();
  await loaded(page.locator('.copy-email .illustration-toggers'));
  await page.getByRole('button', { name: 'Quick links' }).click();
  await loaded(page.getByRole('dialog').locator('.illustration-calyrex-gamer'));
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

test('section identities remain readable and contained across viewport sizes and themes', async ({
  page,
}, info) => {
  test.setTimeout(60000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const theme of ['light', 'dark']) {
    await page.goto(`./?atmosphere=storm&theme=${theme}&time=night&moonPhase=full&motion=freeze`);
    for (const width of [320, 390, 768, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      for (const section of ['#work', '#experience', '#about', '#contact']) {
        const identity = page.locator(`${section} .section-identity`);
        const image = identity.locator('img');
        await image.scrollIntoViewIfNeeded();
        const art = await image.boundingBox();
        const heading = await identity.locator('h2').boundingBox();
        expect(art && heading && art.x + art.width <= heading.x).toBeTruthy();
        expect(heading && heading.x + heading.width <= width).toBeTruthy();
        expect(heading && heading.height < 50).toBeTruthy();
        await expect(image).toHaveCSS('pointer-events', 'none');
        await expect(image).toHaveAttribute('alt', '');
        if (info.project.name === 'desktop' && [320, 1440].includes(width)) {
          await page
            .locator(section)
            .screenshot({ path: `.local/hatchet-${theme}-${width}-${section.slice(1)}.png` });
        }
      }
      await expect(page.locator('.celestial-body')).toHaveCSS('opacity', '1');
      const layers = await page.evaluate(() =>
        ['.cloud-layer', '.constellation-layer', '.celestial-body', '.precipitation-layer'].map(
          (selector) => Number(getComputedStyle(document.querySelector(selector)!).zIndex),
        ),
      );
      expect(layers.every((z, i) => i === 0 || z > layers[i - 1])).toBeTruthy();
    }
  }
});
