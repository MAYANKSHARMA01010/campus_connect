const { AsyncLocalStorage } = require("node:async_hooks");

const requestContextStorage = new AsyncLocalStorage();

function runWithRequestContext(context, callback) {
  return requestContextStorage.run(context, callback);
}

function getRequestContext() {
  return requestContextStorage.getStore() || {};
}

module.exports = {
  runWithRequestContext,
  getRequestContext,
};