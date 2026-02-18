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

module.exports = { test_email, invalid_contact_form, missing_subject_form, missing_message_form, valid_contact_form };
