const UAParser = require('ua-parser-js');
const CustomError = require('../utils/CustomError');

const BREAKPOINT = 992;          // px

module.exports = () => async (req, _res, next) => {
  /* 1. Pull viewport width (header first, UA fallback) */
  const w = Number(req.headers['x-viewport-width']);
  const uaWidthBased = Number.isNaN(w)
    ? /mobile|tablet/i.test(new UAParser(req.headers['user-agent'])
        .getDevice().type || '')
    : w < BREAKPOINT;

  /* 2. If there’s no authenticated employee, do nothing */
  if (!req.employee) return next();

  /* 3. Enforce the user’s own setting */
  if (!req.employee.allowMobileLogin && uaWidthBased) {
    return next(
      new CustomError(
        'Your profile is set to block mobile access. Please use a desktop device or ask HR to enable mobile login.',
        403
      )
    );
  }

  next();
};
