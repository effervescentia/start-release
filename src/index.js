import { spawn } from 'child_process';
import preRelease from './pre';
import postRelease from './post';

const publish = (log, isPublic) => {
  log('publishing to npm');

  return new Promise((resolve, reject) => {
    const proc = spawn('npm', ['publish']
      .concat(isPublic ? ['--access', 'public'] : []));

    proc.stdout.on('data', (data) => log(`${data}`));
    proc.stderr.on('data', (data) => log(`${data}`));

    proc.on('close', () => {
      log('published!');
      resolve();
    }).on('error', (err) => reject(err));
  });
};

export default (opts = {}) => () => {
  return function release(log) {
    return preRelease(opts.options, log)
      .then(() => publish(log, opts.public))
      .then(() => postRelease(opts.options, log));
  };
};
