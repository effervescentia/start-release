import postRelease from 'semantic-release/src/post';
import configure from './config';

export default (opts, log) => {
  log('running post release');

  configure(opts, log)
    .then((config) => new Promise((resolve, reject) =>
      postRelease(config, (err) => {
        if (err) {
          log('falied to publish release notes');

          return reject(err);
        }

        log('release notes published');
      })));
};
