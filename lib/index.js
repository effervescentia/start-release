import npmRun from 'npm-run';

export default (ci = 'travis') => (input) => {
  return function startRelease (log) {
    return execPromise(`${getEnv(ci)} semantic-release pre`)
      .then(() => execPromise('npm publish'))
      .then(() => execPromise('semantic-release post'))
      .then(() => input)
      .catch((err) => console.error(err));
  };
};

const getEnv = (condition) => {
  switch (condition) {
    case 'circle': return 'CIRCLECI=true';
    case 'snap': return 'SNAP_CI=true';
    case 'wercker': return 'WERCKER=true';
    case 'travis': return 'TRAVIS=true';
    default: '';
  }
};

const execPromise = (command) => {
  return new Promise((resolve, reject) => {
    npmRun.exec(command, {}, (err, stdout, stderr) => {
      if (err) {
        return reject(err);
      }

      if (stderr) {
        console.log(stderr);
      }

      console.log(stdout);

      resolve();
    });
  });
};
