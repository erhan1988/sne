const COLORS = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
};

const logSuccess = (message) => {
  console.log(`${COLORS.green}${message}${COLORS.reset}`);
};

const logError = (message) => {
  console.error(`${COLORS.red}${message}${COLORS.reset}`);
};

module.exports = { logSuccess, logError };
