/**
 * Parse profile.
 *
 * @param {Object|String} json
 * @property {String} json.id
 * @property {String} json.name
 * @property {String} json.login
 * @property {String} json.html_url
 * @property {String} json.email
 *
 * @return {Object}
 * @api private
 */
exports.parse = function (json) {
  if ('string' === typeof json) {
    json = JSON.parse(json);
  }

  const profile = {};
  profile.id = String(json.id);
  profile.displayName = json.name;
  profile.username = json.login;
  profile.profileUrl = json.html_url;
  if (json.email) {
    profile.emails = [{value: json.email}];
  }

  return profile;
};