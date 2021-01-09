const casual = require('casual');

casual.define('PhoneNumber', id => {
  return {
    country: casual.country_code.toLowerCase(),
    phoneNumber: casual.phone,
    email: casual.email,
    name: casual.name,
    id
  }
});

module.exports = count => {
  const phoneNumbers = {};
  [...Array(count).keys()].forEach(index => {
    const id = casual.uuid;
    phoneNumbers[id] = casual.PhoneNumber(id);
  });
  return phoneNumbers;
}


