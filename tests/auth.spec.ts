import { test, expect } from '@playwright/test';

test.describe('Authentication and Route Protection Smoke Tests', () => {
  test('1. Logged-out user clicking "Start Learning" redirects to /login?next=%2Fapp', async ({ page }) => {
    await page.goto('/');

    // Check landing page hero is visible
    await expect(page.locator('h1')).toContainText('Learn the Ancient Coastal Language');

    // Find and click the main "Start Learning Now" button
    const startLearningBtn = page.getByRole('link', { name: /Start Learning/i }).first();
    await expect(startLearningBtn).toBeVisible();
    await startLearningBtn.click();

    // Verify redirected to login with next parameter
    await expect(page).toHaveURL(/\/login\?next=%2Fapp/);
    await expect(page.getByText('Sign in to TuluGPT')).toBeVisible();
    await expect(page.getByText('Continue with Google')).toBeVisible();
  });

  test('2. Direct navigation to /app redirects logged-out user to /login?next=%2Fapp', async ({ page }) => {
    await page.goto('/app');
    await expect(page).toHaveURL(/\/login\?next=%2Fapp/);
  });

  test('3. Direct navigation to /curriculum redirects logged-out user to /login?next=%2Fcurriculum', async ({ page }) => {
    await page.goto('/curriculum');
    await expect(page).toHaveURL(/\/login\?next=%2Fcurriculum/);
  });

  test('4. Login page has zero mock/demo simulation bypasses', async ({ page }) => {
    await page.goto('/login');

    // Confirm real Google and Email OTP options are present
    await expect(page.getByText('Continue with Google')).toBeVisible();
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible();

    // Confirm simulation/quick start buttons are completely absent
    await expect(page.getByText(/Instant Quick Start/i)).toHaveCount(0);
    await expect(page.getByText(/Demo Mode/i)).toHaveCount(0);
    await expect(page.getByText(/Simulation/i)).toHaveCount(0);
  });

  test('5. Setup Check page /setup-check renders diagnostics correctly', async ({ page }) => {
    await page.goto('/setup-check');
    await expect(page.getByText('System Setup & Health Check')).toBeVisible();
    await expect(page.getByText('Google Cloud Console Authorized Redirect URI')).toBeVisible();
  });
});
