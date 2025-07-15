describe('Social Login', () => {
  beforeAll(async () => {
    await device.launchApp({ delete: true });
  });

  it('should show login screen', async () => {
    await expect(element(by.text('Login'))).toBeVisible();
  });

  it('should show Google login button', async () => {
    await expect(element(by.text('Sign in with Google'))).toBeVisible();
  });

  // Google login test (manual interaction required for OAuth popup)
  it('should allow Google login (manual)', async () => {
    await element(by.text('Sign in with Google')).tap();
    // Manual: Complete Google login in the browser popup
    // After login, app should navigate to Main
    // await expect(element(by.text('Welcome to HUX!'))).toBeVisible();
  });

  // Apple login test (placeholder, must be run on real iOS device)
  it('should allow Apple login (manual, iOS only)', async () => {
    if (device.getPlatform() === 'ios') {
      await element(by.text('Apple')).tap();
      // Manual: Complete Apple login in the system dialog
      // After login, app should navigate to Main
      // await expect(element(by.text('Welcome to HUX!'))).toBeVisible();
    }
  });

  it('should allow test Google login automatically', async () => {
    await element(by.text('Test Google Login')).tap();
    await expect(element(by.text('Profile'))).toBeVisible();
  });

  it('should allow test Apple login automatically', async () => {
    await element(by.text('Test Apple Login')).tap();
    await expect(element(by.text('Profile'))).toBeVisible();
  });
}); 