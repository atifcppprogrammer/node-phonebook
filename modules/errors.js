class ResourceNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ResourceNotFoundError';
  }
}

class ServerError extends Error {
  constructor (message) {
    super(message);
    this.name = "ServerError";
  }
}

module.exports = { 
  ResourceNotFoundError,
  ServerError
}


