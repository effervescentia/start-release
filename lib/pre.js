import fs from 'fs';
import nerfDart from 'nerf-dart';
import preRelease from 'semantic-release/src/pre';
import configure from './config';

/* eslint-disable no-sync, no-magic-numbers */
export default (opts, log) => {
  log('running pre release');
  const originalPkg = JSON.parse(fs.readFileSync('./package.json'));

  configure(opts, log)
    .then((config) => new Promise((resolve, reject) =>
      // eslint-disable-next-line no-confusing-arrow, no-ternary
      config.plugins.verifyConditions(config, (err) => err ? reject(err) : resolve(config))))
    .then((config) => {
      // eslint-disable-next-line object-curly-newline
      const { conf, env, npm } = config;
      const nerf = nerfDart(npm.registry);
      let authed = false;

      /* eslint-disable no-template-curly-in-string */
      if (env.NPM_OLD_TOKEN && env.NPM_EMAIL) {
        conf.set('_auth', '${NPM_OLD_TOKEN}', 'project');
        conf.set('email', '${NPM_EMAIL}', 'project');
        authed = true;
      } else if (env.NPM_TOKEN) {
        conf.set(`${nerf}:_authToken`, '${NPM_TOKEN}', 'project');
        authed = true;
      }
      /* eslint-enable no-template-curly-in-string */

      return new Promise((resolve, reject) => {
        conf.save('project', (err) => {
          if (err) {
            return reject(err);
          }

          if (authed) {
            log('wrote to .npmrc successfully');
          }
          resolve(config);
        });
      });
    })
    .then((config) => new Promise((resolve, reject) => {
      preRelease(config, (err, { version }) => {
        const { npm, options } = config;

        if (err) {
          log('failed to determine new version');

          return reject(err);
        }
        if (options.debug) {
          reject(new Error('skipping release because debug is set'));
        }

        log(`next version: ${version} as ${npm.tag}`);

        try {
          const shrinkwrap = {
            ...JSON.parse(fs.readFileSync('./npm-shrinkwrap.json')),
            ...{ version }
          };

          fs.writeFileSync('./npm-shrinkwrap.json', JSON.stringify(shrinkwrap, null, 2));
          log(`updated npm-shrinkwrap.json version to ${version}`);
        } catch (e) {
          log('no npm-shrinkwrap.json found');
        }

        fs.writeFileSync('./package.json', JSON.stringify({
          ...originalPkg,
          ...{ version }
        }, null, 2));
        log(`updated package.json version to ${version}`);
      });
    }));
};
