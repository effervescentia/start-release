import execa from 'execa';
import preRelease from './pre';
import postRelease from './post';

const publish = (log) => {
  log('publishing to npm');

  return execa.shell('npm', ['publish'])
    .then((res) => {
      if (res.stderr) {
        throw new Error(res.stderr);
      }

      return log(res.stdout);
    });
};

export default (opts) => () => {
  return function release(log) {
    return preRelease(opts, log)
      .then(() => publish(log))
      .then(() => postRelease(opts, log));
  };
};
