import { test, expect } from '@playwright/test';

test('landing loads and dashboard link works', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('AgentBuddy — Cyber Pulse')).toBeVisible();
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page).toHaveURL(/.*\/dashboard/);
});


