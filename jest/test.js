const bcrypt = require('bcryptjs');
const login = require('../controllers/login');
const student = require('../controllers/student');
const mathPassword = login.mathPassword;
const hashCode = student.hashCode;


test('MathPassword เท่ากับ ture', async function () {
  const salt = await bcrypt.genSalt(10);
  const password_01 = 'p@ssw0d';
  const password_02 = 'p@ssw0d';
  const passwordHash = await bcrypt.hash(password_02, salt);
  expect(await mathPassword(password_01, passwordHash)).toBe(true);
});

test('MathPassword เท่ากับ false', async function () {
  const salt = await bcrypt.genSalt(10);
  const password_01 = 'p@12222';
  const password_02 = 'p@ssw0d';
  const passwordHash = await bcrypt.hash(password_02, salt);
  expect(await mathPassword(password_01, passwordHash)).toBe(false);
});

test('hashCode เท่ากับ ture', async function () {
  var status = false;
  const password_01 = 'p@ssw0d';
  const password_02 = 'p@ssw0d';
  const passwordHash = await hashCode(password_02);
  const check = await bcrypt.compare(password_01, passwordHash);
  if (check) {
    status = true;
  } else {
    status = false;
  }
  expect(status).toBe(true);
});

test('hashCode เท่ากับ false', async function () {
  var status = false;
  const password_01 = 'p@w0d';
  const password_02 = 'p@ssw0d';
  const passwordHash = await hashCode(password_02);
  const check = await bcrypt.compare(password_01, passwordHash);
  if (check) {
    status = true;
  } else {
    status = false;
  }
  expect(status).toBe(false);
});

