// Types
import { RequestHandler } from 'express';
import { CookieController, CustomErrorGenerator, UserDocument } from '../backendTypes';

// Error generation helper function
import controllerErrorMaker from '../utils/controllerErrorMaker';
const createErr: CustomErrorGenerator = controllerErrorMaker('cookieController');

//---SET SSID COOKIE ------------------------------------------------------------------------------------------------------

//ssid cookie value will be the logged in user's mongodb document id
const setSSIDCookie: RequestHandler = async (req, res, next) => {
  // Make sure login/signup was successful and userDocument exists
  if (res.locals.status !== 'validUser' || res.locals.userDocument === null) {
    return next();
  }

  //Extract Mongodb id from getUser middleware userDocument
  const userDocument: UserDocument = res.locals.userDocument;
  const userId = userDocument._id.toString();

  try {
    //create new cookie with key:value of ssid: Mongo ObjectID
    res.cookie('ssid', userId, {
      secure: true,
      httpOnly: true,
      sameSite: 'lax'
    });

    return next();
  } catch (err) {
    return next(
      createErr({
        method: 'setSSIDCookie',
        overview: 'creating setSSIDCookie for user',
        status: 400,
        err
      })
    );
  }
};

const cookieController: CookieController = { setSSIDCookie };

export default cookieController;
