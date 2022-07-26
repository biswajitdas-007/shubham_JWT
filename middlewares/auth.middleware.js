const jwt = require("jsonwebtoken");

function auth(req, res, next) {
	let token = req.headers["authorization"];
	token = token.split(" ")[1];

	jwt.verify(token, "access", (err, user) => {
		// console.log('token:', err,user);
		if (!err) {
			req.user = user;
			next();
		} else {
			return res.status(403).json({ message: "user not authenticated" });
		}
	});
}

module.exports = {
	auth,
};
