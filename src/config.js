import fs from 'fs';
import url from 'url';
import npmconf from 'npmconf';
import normalizePkg from 'normalize-package-data';
import getRegistry from 'semantic-release/src/lib/get-registry';
import getPlugins from 'semantic-release/src/lib/plugins';
import verifyConfig from 'semantic-release/src/lib/verify';

const env = process.env;

export const DEFAULTS = {
  branch: 'master',
  fallbackTags: { next: 'latest' },
  debug: !env.CI,
  githubToken: env.GH_TOKEN || env.GITHUB_TOKEN,
  githubUrl: env.GH_URL
};

export const getPkg = () => {
  // eslint-disable-next-line no-sync
  const pkg = { ...JSON.parse(fs.readFileSync('./package.json')) };

  normalizePkg(pkg);

  return pkg;
};

export const getOptions = (pkg, opts) => ({
  ...DEFAULTS,
  ...(pkg.release || {}),
  ...opts
});

export const getNpm = (pkg, conf) => ({
  auth: { token: env.NPM_TOKEN },
  cafile: conf.get('cafile'),
  registry: getRegistry(pkg, conf),
  tag: (pkg.publishConfig || {}).tag || conf.get('tag') || 'latest'
});

export const generate = (conf, opts, log) => {
  const pkg = getPkg();
  const options = getOptions(pkg, opts);
  const plugins = getPlugins(options);
  const npm = getNpm(pkg, conf);

  // eslint-disable-next-line immutable/no-mutation
  npm.registry = url.format(url.parse(npm.registry));

  // eslint-disable-next-line object-curly-newline
  const config = { conf, env, pkg, options, plugins, npm };

  if (options.debug) {
    // eslint-disable-next-line no-magic-numbers
    log(`options: ${JSON.stringify({ ...options, ...{ githubToken: '***' } }, null, 2)}`);
  }

  return config;
};

export const verify = (config, log) => {
  const errors = verifyConfig(config);

  // eslint-disable-next-line no-magic-numbers
  if (errors.length) {
    errors.forEach((err) => log(err.message));
    throw new Error('verification failed');
  }

  return config;
};

export default (opts, log) => {
  log('generating configuration');

  return new Promise((resolve, reject) =>
      // eslint-disable-next-line no-confusing-arrow, no-ternary
      npmconf.load({}, (err, conf) => err ? reject(err) : resolve(conf)))
    .then((conf) => generate(conf, opts, log))
    .then((config) => verify(config, log));
};
