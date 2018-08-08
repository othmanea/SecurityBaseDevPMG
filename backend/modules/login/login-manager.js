exports.login = function login(username, password) {
  ha1keyCode = "";
  const u = ds.User.find('email === :1', username);
  if (u) {
    ha1keyCode = directory.computeHA1(u.ID, password);
  }
  // if (!u || u.password !== password) { // login sans Hash
  if (!u || u.HA1Key !== ha1keyCode) {
    return false;
    return {
      // Error code returned
      error: 548,
      // Error text returned
      errorMessage: 'Authentication failed. Login or Password maybe wrong.'
    };
  }
  const roles = u.role ? u.role.split(',') : [];
  return {
    ID: u.getKey(),
    name: u.email,
    fullName: u.fullName,
    belongsTo: roles,
    storage: {
      ID: u.getKey(),
      group: roles,
      username: u.username,
      name: u.name
    }
  };
}
