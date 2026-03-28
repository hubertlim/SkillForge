// Onboarding persistence helpers

const ONBOARDING_KEY = 'skillforge-onboarding-seen';

export function shouldShowOnboarding(): boolean {
  try {
    return !localStorage.getItem(ONBOARDING_KEY);
  } catch {
    return false;
  }
}

export function dismissOnboarding() {
  try {
    localStorage.setItem(ONBOARDING_KEY, '1');
  } catch {
    // ignore
  }
}

export function resetOnboarding() {
  try {
    localStorage.removeItem(ONBOARDING_KEY);
  } catch {
    // ignore
  }
}
