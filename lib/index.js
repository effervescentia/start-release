import npmRun from 'npm-run';

export default (ci = 'travis') => (input) => {
  return function startRelease (log) {
    return execPromise('semantic-release pre')
      .then(() => execPromise('npm publish'))
      .then(() => execPromise('semantic-release post'))
      .then(() => input)
      .catch((err) => console.error(err));
  };
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
