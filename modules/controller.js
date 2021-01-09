const {
  performPhonebookCrud,
  serveClientResource,
  parseRequestBody
} = require('./helpers');

const {
  ResourceNotFoundError
} = require('./errors');

const casual = require('casual');

const editNumber = (phonebook, entry, id) => {
  if (!phonebook.phoneNumbers[id]) {
    const message = `no phonebook entry found with id ${id}`;
    throw new ResourceNotFoundError(message);
  }
  return {
    ...phonebook,
    phoneNumbers:{
      ...phonebook.phoneNumbers, [id]: { ...entry, id }
    }
  }
  return newPhonebook;
}

const removeNumber = (phonebook, id) => {
  if (!phonebook.phoneNumbers[id]) {
    const message = `no phonebook entry found with id ${id}`;
    throw new ResourceNotFoundError(message);
  }
  delete phonebook.phoneNumbers[id];
  return phonebook;
}

const addNumber = (phonebook, entry) => {
  const id = casual.uuid;
  return { 
    ...phonebook,
    phoneNumbers: { 
      ...phonebook.phoneNumbers, [id]: { ...entry, id }
    }
  }
}

exports.removeNumberFromPhonebook = (req, callback) => {
  parseRequestBody(req, (error, body) => {
    if (error) return callback(error);
    performPhonebookCrud((error, phonebook, writeToPhonebook) => {
      if (error) return callback(error);
      try {
	const { id } = body;
	const newPhonebook = removeNumber(phonebook, id);
	writeToPhonebook(newPhonebook, callback);
      }
      catch (error) {
	return callback(error);
      }
    });
  });
}

exports.editNumberInPhonebook = (req, callback) => {
  parseRequestBody(req, (error, body) => {
    if (error) return callback(error);
    performPhonebookCrud((error, phonebook, writeToPhonebook) => {
      if (error) return callback(error);
      try {
	const { id, entry } = body;
	const newPhonebook = editNumber(phonebook, entry, id);
	writeToPhonebook(newPhonebook, callback);
      }
      catch (error) {
	return callback(error);
      }
    });
  });
}

exports.addNumberToPhonebook = (req, callback) => {
  parseRequestBody(req, (error, body) => {
    if (error) return callback(error);
    performPhonebookCrud((error, phonebook, writeToPhonebook) => {
      if (error) return callback(error);
      try {
	const { entry } = body;
	const newPhonebook = addNumber(phonebook, entry);
	writeToPhonebook(newPhonebook, callback);
      }
      catch (error) {
	return callback(error);
      }
    });
  });
}

exports.selectPageForPhonebookEdit = (id, callback) => {
  performPhonebookCrud((error, phonebook) => {
    if (error) return callback(error);
    const found = phonebook.phoneNumbers[id] !== undefined;
    const path = 'pages/'
      .concat(!found ? '404.html' : 'edit.html');
    const status = !found ? 404 : 200;
    callback(null, path, status);
  });
}

exports.getNumbersFromPhonebook = callback => {
  performPhonebookCrud((error, phonebook) => {
    const phoneNumbers = phonebook.phoneNumbers;
    callback(error, { phoneNumbers });
  });
}
