import execa from 'execa';
import preRelease from './pre';
import postRelease from './post';

const publish = (log) => execa('npm', ['publish'])
  .then((res) => log(res.stdout));

export default (opts) => () => {
  return function release(log) {
    return preRelease(opts, log)
      .then(() => publish())
      .then(() => postRelease(opts, log));
  };
};
