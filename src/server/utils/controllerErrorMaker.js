const controllerErrorMaker = (controllerName) => {
  return ({ method, overview, status, err }) => {
    const errorObj = {
      log: `${controllerName}.${method} ${overview}: ERROR: ${typeof err === 'object' ? err.message : err}`,
      message: { err: `Error occurred in ${controllerName}.${method}. Check server logs for more details.` }
    };
    if (status) {
      errorObj.status = status;
    }
    return errorObj;
  };
};

module.exports = controllerErrorMaker;