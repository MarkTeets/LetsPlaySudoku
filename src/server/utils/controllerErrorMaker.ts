// Types
import { CustomErrorOutput, CustomErrorGenerator } from '../backendTypes';

const controllerErrorMaker = (controllerName: string) => {
  const customErrorGenerator: CustomErrorGenerator = ({ method, overview, status, err }) => {
    const errorObj: CustomErrorOutput = {
      log: `${controllerName}.${method} ${overview}: ERROR: `,
      message: {
        err: `Error occurred in ${controllerName}.${method}. Check server logs for more details.`
      }
    };

    if (status) {
      errorObj.status = status;
    }

    // Type validation and handling for CustomErrorInput
    if (typeof err === 'string') {
      errorObj.log += err;
    } else if (err instanceof Error) {
      errorObj.log += err.message;
    } else {
      errorObj.log += `unknown type found. Investigate try-catch blocks in ${method}`;
    }

    return errorObj;
  };
  return customErrorGenerator;
};

export default controllerErrorMaker;
