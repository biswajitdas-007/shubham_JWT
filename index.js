const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const { auth } = require("./middlewares/auth.middleware");
let refreshArray = [];
app.use(express.json());

app.post("/protected", auth, (req, res) => {
	res.send("Inside protected route");
});

app.post("/renewAccessToken", (req, res) => {
	const refreshToken = req.body.token;

	if (!refreshToken || !refreshToken.includes(refreshToken)) {
		return res
			.status(403)
			.json({ message: "Refresh token not found, login again" });
	} else {
		jwt.verify(refreshToken, "refresh", (err, user) => {
			if (!err) {
				const accessToken = jwt.sign({ username: user.name }, "access", {
					expiresIn: "5s",
	 			});
				return res.status(201).json({ success: true, accessToken });
			} else {
				return res
					.status(403)
					.json({ success: false, message: "Invalid refresh token" });
			}
		});
	}
});

app.post("/login", (req, res) => {
	const { user } = req.body;
	if (!user) {
		return res.status(404).json({ message: "body empty" });
	}
	let accessToken = jwt.sign(user, "access", { expiresIn: "20s" });
	let refreshToken = jwt.sign(user, "refresh", { expiresIn: "7d" });
	refreshArray.push(refreshToken);
	return res.status(200).json({
		accessToken,
		refreshToken,
	});
});

app.listen(5000, () => {
	console.log("server running");
});
