// Types
import { CustomErrorOutput, CustomErrorGenerator } from '../backendTypes';

const controllerErrorMaker = (controllerName: string) => {
  const customErrorGenerator: CustomErrorGenerator = ({ method, overview, status, err }) => {
    const errorObj: CustomErrorOutput = {
      log: `${controllerName}.${method} ${overview}: ERROR: ${
        typeof err === 'object' ? err.message : err
      }`,
      message: {
        err: `Error occurred in ${controllerName}.${method}. Check server logs for more details.`
      }
    };
    if (status) {
      errorObj.status = status;
    }
    return errorObj;
  };
  return customErrorGenerator;
};

export default controllerErrorMaker;
