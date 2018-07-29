const isTesting: boolean = ((() => {
  const qunitTesting = !!(window && (window as any).QUnit);
  return qunitTesting;
})());
export default isTesting;