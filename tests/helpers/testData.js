const test_email = process.env.TEST_EMAIL || 'test@example.com';

const invalid_contact_form = {
	fullName: 'Erhan',
	email: 'test@',
	subject: 'Hello',
	message: 'This is test',
};

const missing_subject_form = {
	fullName: 'Erhan',
	email: test_email,
	subject: '',
	message: 'This is test',
};

const missing_message_form = {
	fullName: 'Erhan',
	email: test_email,
	subject: 'Hello',
	message: '',
};

const valid_contact_form = {
	fullName: 'Erhan',
	email: test_email,
	subject: 'Hello',
	message: 'This is test',
};

const invalid_registration_email = {
	fullName: 'Erhan Demirov',
	email: 'test@',
	password: 'Test1234!',
	confirmPassword: 'Test1234!',
	acceptTerms: true,
};

const getInvalidPasswordMismatchData = () => ({
	fullName: 'Erhan Demirov',
	email: `test+${Date.now()}@yahoo.com`,
	password: 'Test1234!',
	confirmPassword: 'Test12345!',
	acceptTerms: true,
});

const generateEmail = (baseEmail) => {
	if (!generateEmail.generatedEmail) {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');
		const hours = String(now.getHours()).padStart(2, '0');
		const minutes = String(now.getMinutes()).padStart(2, '0');
		const seconds = String(now.getSeconds()).padStart(2, '0');

		generateEmail.generatedEmail = baseEmail.replace(
			'+',
			`+${year}${month}${day}${hours}${minutes}${seconds}`
		);
	}

	return generateEmail.generatedEmail;
};

const getValidRegistrationData = () => {
	const baseEmail = 'test+@yahoo.com';
	const emailWithDate = generateEmail(baseEmail);
	return {
		fullName: 'Erhan Demirov',
		email: emailWithDate,
		password: 'Test1234!',
		confirmPassword: 'Test1234!',
		acceptTerms: true,
	};
};

module.exports = {
	test_email,
	invalid_contact_form,
	missing_subject_form,
	missing_message_form,
	valid_contact_form,
	invalid_registration_email,
	getInvalidPasswordMismatchData,
	getValidRegistrationData,
	generateEmail,
};
