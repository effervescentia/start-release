import preRelease from './pre';
import postRelease from './post';

const publish = () => new Promise((resolve, reject) => {
  require('spork')('npm', ['publish'], { exit: false, quiet: true })
    // eslint-disable-next-line no-confusing-arrow, no-ternary, no-magic-numbers
    .on('exit:code', (code) => code === 0 ?
      resolve() :
      reject(new Error('failed to publish to npm')));
});

export default (opts) => () => {
  return function release(log) {
    return preRelease(opts, log)
      .then(() => publish())
      .then(() => postRelease(opts, log));
  };
};
