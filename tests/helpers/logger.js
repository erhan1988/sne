const COLORS = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
};

let stepPrefix = '';

const setStepPrefix = (prefix) => {
  stepPrefix = prefix ? `${prefix} ` : '';
};

const clearStepPrefix = () => {
  stepPrefix = '';
};

const withPrefix = (message) => `${stepPrefix}${message}`;

const logSuccess = (message) => {
  console.log(`${COLORS.green}${withPrefix(message)}${COLORS.reset}`);
};

const logError = (message) => {
  console.error(`${COLORS.red}${withPrefix(message)}${COLORS.reset}`);
};

const logInfo = (message) => {
  console.log(`${COLORS.cyan}${withPrefix(message)}${COLORS.reset}`);
};

module.exports = { logSuccess, logError, logInfo, setStepPrefix, clearStepPrefix };
