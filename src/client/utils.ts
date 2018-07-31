export function inTestEnvironment() {
  return typeof QUnit !== 'undefined';
}

export function inAppEnvironment() {
  return !inTestEnvironment();
}
