const execa = require('execa');
const semver = require('semver');
const inquirer = require('inquirer');

const curVersion = require('../package').version;
const bumps = ['patch', 'minor', 'major', 'prerelease', 'premajor'];

const redTips = (msg) =>
  // eslint-disable-next-line
  console.log('\x1b[1;31m' + msg + '\x1b[0m');

const versions = bumps.reduce((acc, val) => {
  acc[val] = semver.inc(curVersion, val);
  return acc;
}, {});

const bumpChoices = bumps.reduce((acc, val) => {
  acc.push({
    name: `${val} (${versions[val]})`,
    value: `${val}`
  });
  return acc;
}, []);

async function release() {
  const { bump, customVersion, npmTag } = await inquirer.prompt([
    {
      name: 'bump',
      message: 'Please choose the release type:',
      type: 'list',
      choices: [...bumpChoices, { name: 'custom', value: 'custom' }]
    },
    {
      name: 'customVersion',
      message: 'Please input the version:',
      type: 'input',
      when: (answers) => answers.bump === 'custom'
    },
    {
      name: 'npmTag',
      message: 'Please choose the tag',
      type: 'list',
      choices: ['latest', 'beta', 'alpha']
    }
  ]);

  const curVersion = customVersion || versions[bump];

  const { confirm } = await inquirer.prompt({
    name: 'confirm',
    message: `Please confirm the version ${curVersion}`,
    type: 'list',
    choices: ['Y', 'N']
  });

  if (confirm === 'N') {
    redTips('exit publish');
    return;
  }

  const promise = execa('bash', ['scripts/publish.sh', curVersion, npmTag]);
  promise.stdout.pipe(process.stdout);
  promise.stderr.pipe(process.stderr);
  // eslint-disable-next-line
  (async () => {
    try {
      const { stdout, stderr } = await promise;
      stdout && redTips(stdout);
      stderr && redTips(stderr);
    } catch (error) {
      redTips(error.stderr);
    }
  })();
}

release();
