// Error generation helper function
const controllerErrorMaker = require('../utils/controllerErrorMaker');
const createErr = controllerErrorMaker('cookieController');

const cookieController = {};

//---SET SSID COOKIE ------------------------------------------------------------------------------------------------------

//ssid cookie value will be the logged in user's mongodb document id
cookieController.setSSIDCookie = async (req, res, next) => {
  try {
    //Extract Mongodb id from getUser middleware userDocument
    const userId = res.locals.userDocument?.id;

    // If the login or signup was unsuccessful, move on without creating a cookie
    if (res.locals.status !== 'validUser' || userId === undefined) {
      return next();
    }

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

module.exports = cookieController;
