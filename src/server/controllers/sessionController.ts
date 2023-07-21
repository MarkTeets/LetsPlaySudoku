// Models
import Session from '../models/sessionModel';

// Types
import { RequestHandler } from 'express';
import { SignInResponse } from '../../types';
import {
  SessionController,
  CustomErrorGenerator,
  UserDocument,
  BackendStatus
} from '../backendTypes';

// Helper function: createErr will return an object formatted for the global error handler
import controllerErrorMaker from '../utils/controllerErrorMaker';
const createErr: CustomErrorGenerator = controllerErrorMaker('sessionController');

//---START SESSION --------------------------------------------------------------------------------------------------------------------------

const startSession: RequestHandler = async (req, res, next) => {
  // Make sure login/signup was successful and userDocument exists
  if (res.locals.status !== 'validUser' || res.locals.userDocument === null) {
    return next();
  }

  //Extract Mongodb id from getUser or createUser middleware userDocument
  const userDocument: UserDocument = res.locals.userDocument;
  const userId = userDocument._id.toString();

  try {
    // Upsert session to Session collection
    const filter = { cookieId: userId };
    const update = { $currentDate: { createdAt: true } };
    const options = { new: true, upsert: true };

    // As upsert and new are set to true, this will never return null.
    // Failure will result in a thrown error
    await Session.findOneAndUpdate(filter, update, options);

    return next();
  } catch (err) {
    return next(
      createErr({
        method: 'startSession',
        overview: 'creating session document for user',
        status: 400,
        err
      })
    );
  }
};

//---IS LOGGED IN --------------------------------------------------------------------------------------------------------------------------

const isLoggedIn: RequestHandler = async (req, res, next) => {
  const cookieId = req.cookies.ssid;

  // See if ssid cookie exists, if not redirect to no session path
  if (typeof cookieId !== 'string') {
    return res.redirect('/api/user/no-session');
  }

  try {
    //find request for session with key cookieId with value matching cookie ssid
    const verifiedLogin = await Session.findOne({ cookieId });
    // if it's null, continue through middleware without adding extra info
    if (verifiedLogin === null) {
      return res.redirect('/api/user/no-session');
    }

    // set res.locals.status so cleanUser will process the userDocument for the frontend
    res.locals.status = 'validUser' as BackendStatus;

    return next();
  } catch (err) {
    return next(
      createErr({
        method: 'isLoggedIn',
        overview: 'finding session document for user',
        status: 400,
        err
      })
    );
  }
};

//---LOG OUT --------------------------------------------------------------------------------------------------------------------------

const logOut: RequestHandler = async (req, res, next) => {
  // Make sure getUser was successful and userDocument exists
  if (res.locals.userDocument === null) {
    res.locals.frontendData = { status: 'userNotFound' };
    return next();
  }

  //Extract Mongodb id from getUser or createUser middleware userDocument
  const userDocument: UserDocument = res.locals.userDocument;
  const userId = userDocument._id.toString();

  try {
    // Find and delete session from session collection
    const deletedSession = await Session.findOneAndDelete({ cookieId: userId });

    if (deletedSession === null) {
      return next(
        createErr({
          method: 'logOut',
          overview: 'deleting session document for user',
          status: 400,
          err: `findOneAndDelete query for user ${res.locals.userDocument.username} returned null`
        })
      );
    }

    // Send success status back to frontend
    res.locals.frontendData = { status: 'valid' } as SignInResponse;

    return next();
  } catch (err) {
    return next(
      createErr({
        method: 'logOut',
        overview: 'deleting session document for user',
        status: 400,
        err
      })
    );
  }
};

const sessionController: SessionController = { startSession, isLoggedIn, logOut };

export default sessionController;
