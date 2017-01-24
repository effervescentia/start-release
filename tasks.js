import { lint as _lint, ci as _ci, prepush as _prepush } from 'start-standard-preset';

export { start, build, coverage, dev, test, tdd } from 'start-standard-preset';

export const lint = _lint.bind(null, 'semistandard');
export const ci = _ci.bind(null, 'semistandard');
export const prepush = _prepush.bind(null, 'semistandard');
