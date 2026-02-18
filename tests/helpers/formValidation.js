async function assertFieldsInvalid(fields, logSuccess) {
  for (const { locator, name } of fields) {
    const isValid = await locator.evaluate((el) => el.checkValidity());
    if (isValid) {
      throw new Error(`${name} is valid but should be invalid when empty`);
    }
    if (logSuccess) {
      logSuccess(`${name} is invalid as expected when empty`);
    }
  }
}

module.exports = { assertFieldsInvalid };
