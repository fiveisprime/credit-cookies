var config = module.exports = {
  production: {
    connection: 'mongodb://<user>:<pass>@<database-url>'
  }
, development: {
    connection: 'mongodb://localhost/test'
  }
};
