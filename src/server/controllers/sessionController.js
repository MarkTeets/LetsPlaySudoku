const Session = require('../models/sessionModel');

// Helper function: createErr will return an object formatted for the global error handler
const controllerErrorMaker = require('../utils/controllerErrorMaker');
const createErr = controllerErrorMaker('sessionController');

const sessionController = {};

//---START SESSION --------------------------------------------------------------------------------------------------------------------------

sessionController.startSession = async (req, res, next) => {
  try {
    //Extract Mongodb id from getUser middleware userDocument
    const userId = res.locals.userDocument?.id;

    // If the login or signup was unsuccessful, move on without creating a session
    if (res.locals.status !== 'validUser' || userId === undefined) {
      return next();
    }

    const filter = { cookieId: userId };
    const update = { $currentDate: { createdAt: true } };
    const options = { new: true, upsert: true };
    const mongoSession = await Session.findOneAndUpdate(filter, update, options);

    if (mongoSession === null) {
      return next(
        createErr({
          method: 'startSession',
          overview: 'creating session document for user',
          status: 400,
          err: 'Failed to update/upsert a new session document'
        })
      );
    }

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

sessionController.isLoggedIn = async (req, res, next) => {
  try {
    //find request for session with key cookieId with value matching cookie ssid
    const verifiedLogin = await Session.findOne({ cookieId: req.cookies.ssid });
    // if it's null, continue through middleware without adding extra info
    if (verifiedLogin === null) {
      return res.redirect('/api/user/no-session');
    }

    // set res.locals.status so cleanUser will process the userDocument for the frontend
    res.locals.status = 'validUser';

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

sessionController.logOut = async (req, res, next) => {
  try {
    // console.log(
    //   'res.locals.userDocument.id',
    //   res.locals.userDocument.id,
    //   typeof res.locals.userDocument.id
    // );

    if (res.locals.userDocument === null) {
      res.locals.frontendData = { status: 'userNotFound' };
      return next();
    }

    const deletedSession = await Session.findOneAndDelete({ cookieId: res.locals.userDocument.id });
    // console.log('deletedSession', deletedSession);
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

    res.locals.frontendData = { status: 'valid' };

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

module.exports = sessionController;
