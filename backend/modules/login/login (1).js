
//Wakanda Login Listener
var login = function (emailAddress, password) {
	var connectTime;
	var myUser = ds.User({email:emailAddress}); // Get the user
debugger;
	if (myUser === null) {
		return false;
	} else {
		//we will handle login
		if (myUser.validatePassword(password)) {
			
			connectTime = new Date();
			return {
				ID: myUser.ID,
				email: myUser.email,
				storage: {time: connectTime}
			}
			
		} else {
			return {error: 1024, errorMessage: "invalid login"};
		}
		
	}
};

module.exports.login = login;
