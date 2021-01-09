const { 
  selectPageForPhonebookEdit,
  removeNumberFromPhonebook,
  getNumbersFromPhonebook,
  editNumberInPhonebook,
  addNumberToPhonebook
} = require('./modules/controller');

const {
  serveClientResource,
  serveJsonResponse
} = require('./modules/helpers');


const { 
  createServer
} = require('http');

const {
  join 
} = require('path');

const {
  writeFile
} = require('fs');

const pathToPhonebook = join(
  __dirname, 'phonebook.json'
);

const initialContent = require('./phonebook.json');

const server = createServer((req, res) => {
  const { method, url } = req;
  const index = [
    /^\/api\/v1\/phonebook\/remove$/,
    /^\/api\/v1\/phonebook\/edit$/,
    /^\/api\/v1\/phonebook\/add$/,
    /^\/api\/v1\/phonebook\/get$/,
    /^\/phonebook\/edit\?id=[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    /^\/phonebook\/add$/,
    /^\/$/,
    /^\/phonebook\/styles$/,
    /^\/phonebook\/assets\/phone$/,
    /^\/phonebook\/assets\/phonebook$/
  ]
  .findIndex(regex => url.match(regex) !== null);

  if (index === 0 && method.toLowerCase() === 'post') {
    removeNumberFromPhonebook(req, error => {
      serveJsonResponse(res, error, 200, {});
    });
  }

  else if (index === 1 && method.toLowerCase() === 'post') {
    editNumberInPhonebook(req, error => {
      serveJsonResponse(res, error, 200, {});
    });
  }

  else if (index === 2 && method.toLowerCase() === 'post') {
    addNumberToPhonebook(req, error => {
      serveJsonResponse(res, error, 200, {});
    });
  }

  else if (index === 3 && method.toLowerCase() === 'get') {
    getNumbersFromPhonebook((error, phoneNumbers) => {
      serveJsonResponse(res, error, 200, phoneNumbers);
    });
  }
 
  else if (index === 4 && method.toLowerCase() === 'get') {
    const id = url.split('=').pop();
    selectPageForPhonebookEdit(id, (error, path, status) => {
      const header = { 'Content-Type': 'text/html' };
      serveClientResource(res, header, status, path);
    });
  }

  else if (index === 5 && method.toLowerCase() === 'get') {
    const header = { 'Content-Type': 'text/html' };
    const path = 'pages/add.html';
    serveClientResource(res, header, 200, path);
  }

  else if (index === 6 && method.toLowerCase() === 'get') {
    const header = { 'Content-Type': 'text/html' };
    const path = 'pages/index.html';
    serveClientResource(res, header, 200, path);
  }

  else if (index === 7 && method.toLowerCase() === 'get') {
    const header = { 'Content-Type': 'text/css' };
    const path = 'styles/index.css';
    serveClientResource(res, header, 200, path);
  }

  else if (index === 8 && method.toLowerCase() === 'get') {
    const header = { 'Content-Type': 'image/svg+xml' };
    const path = 'assets/phone.svg';
    serveClientResource(res, header, 200, path);
  }

  else if (index === 9 && method.toLowerCase() === 'get') {
    const header = { 'Content-Type': 'image/svg+xml' };
    const path = 'assets/phonebook.svg';
    serveClientResource(res, header, 200, path);
  }

  else {
    const header = { 'Content-Type': 'text/html' };
    const path = 'pages/404.html';
    serveClientResource(res, header, 404, path);
  }
});

const init = () => {
  //writeFile('phonebook.json', initialContent, error => {
  //  if (error) throw error; else server.listen(8080);
  //});
  server.listen(8080);
}

init();
