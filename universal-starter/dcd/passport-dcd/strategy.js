/**
 * Module dependencies.
 */
const util = require('util');
const OAuth2Strategy = require('passport-oauth2');
const Profile = require('./profile');
const InternalOAuthError = require('passport-oauth2').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};

  if (!options.userProfileURL) {
    throw new TypeError('OAuth 2.0-based strategy ' +
      'requires a userProfileURL option');
  }

  OAuth2Strategy.call(this, options, verify);
  this._userProfileURL = options.userProfileURL;
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile.
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function (accessToken, done) {
  this._oauth2.get(this._userProfileURL, accessToken, function (err, body) {
    // We can read the response in the 3rd param
    let json;

    if (err) {
      return done(new InternalOAuthError('Failed to fetch user profile', err));
    }

    try {
      json = JSON.parse(body);
    } catch (ex) {
      return done(new Error('Failed to parse user profile'));
    }

    const profile = Profile.parse(json);
    profile._raw = body;
    profile._json = json;
    profile.token = accessToken;
    profile.id = json.sub;

    done(null, profile);
  });
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;