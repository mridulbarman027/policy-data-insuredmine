/* eslint-disable unicorn/prefer-module */
module.exports = {
  apps: [
    {
      name: 'policy-data-insuredmine',
      script: 'src/index.js',
      node_args: '-r dotenv/config',
      instances: 1,
      exec_mode: 'fork_mode',
    },
  ],
};
