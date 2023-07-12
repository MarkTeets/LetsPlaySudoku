// Error generation helper function
const controllerErrorMaker = require('../utils/controllerErrorMaker');
const createErr = controllerErrorMaker('cookieController');

const cookieController = {};

//---SET SSID COOKIE ------------------------------------------------------------------------------------------------------

cookieController.setSSIDCookie = async (req, res, next) => {
  //ssid cookie value will be the Object id of the logged in user
  //Extract Mongodb id from getUser middleware foundUser 
  const { id } = res.locals.foundUser;

  // If the login or signup was unsuccessful, move on without creating a cookie
  if (id === undefined) {
    return next();
  }

  try {
    //create new cookie with key:value of ssid: Mongo ObjectID
    res.cookie('ssid', id, {
      secure: true,
      httpOnly: true,
      sameSite: 'lax'
    });

    return next();
    
  } catch (err) {
    return next(createErr({
      method: 'setSSIDCookie',
      overview: 'creating setSSIDCookie for user',
      status: 400,
      err
    }));
  }
};

module.exports = cookieController;
