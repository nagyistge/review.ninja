
var github = require("../services/github");
var merge = require("merge");

module.exports = {

	call: function(req, done) {
		github(merge(req.args, {token: req.user.token}), done);
	}
};