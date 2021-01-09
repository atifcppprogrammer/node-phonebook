const { 
  createReadStream,
  writeFile,
  readFile,
} = require('fs');

const { 
  join
} = require('path');

const pathToPhonebook = join(
  __dirname, '..', 'phonebook.json'
);

const pathToPublic = join(
  __dirname, '..', 'public'
);

const writeToPhonebook = (content, callback) => {
  const string = JSON.stringify(content);
  writeFile(pathToPhonebook, string, error => { 
    error ? callback(error) : callback(null);
  });
}

exports.serveClientResource = (res, header, status, path) => {
  const fullPath = join(pathToPublic, path);
  const readStream = createReadStream(fullPath);
  res.writeHead(status, header);
  readStream.pipe(res);
}

exports.serveJsonResponse = (res, error, status, payload) => {
  res.writeHead(status, { 
    'Content-Type': 'application/json'
  });
  res.end(JSON.stringify({
    'error': { 
      message: error ? error.message : null,
      name: error ? error.name : null
    },
    'payload': error ? null : payload,
    'status': error ? 500 : status
  }));
}

exports.parseRequestBody = (req, callback) => {
  let body = '';

  req.on('readable', () => {
    const chunk = req.read();
    if (typeof chunk === 'object' && chunk instanceof Buffer)
      body = body.concat(chunk.toString('utf8'));
    else if (typeof chunk === 'string')
      body = body.concat(chunk);
  });

  req.on('end', () => {
    try {
      const parsedBody = JSON.parse(body);
      return callback(null, parsedBody);
    }
    catch (error) {
      return callback(error);
    }
  });

  req.on('error', () => callback(error));
}

exports.performPhonebookCrud = callback => {
  readFile(pathToPhonebook, (error, content) => {
    try {
      const phonebook = JSON.parse(content);
      callback(error, phonebook, writeToPhonebook);
    }
    catch (error) {
      return callback(error);
    }
  });
}
