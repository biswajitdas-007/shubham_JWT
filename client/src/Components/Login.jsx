import React from "react";
import { useState } from "react";
import "../Css/Login.css";
import axios from "axios";
import Cookies from "js-cookie";

const Login = () => {
	const [user, setUser] = useState({});
	const [err, setErr] = useState("");
	const handleChange = (e) => {
		setUser({ ...user, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		// console.log("user:", user);
		axios.post("http://localhost:5000/login", { user }).then((d) => {
			// console.log("data:", d);
			const { accessToken, refreshToken } = d.data;
			Cookies.set("access", accessToken);
			Cookies.set("refresh", refreshToken);
		});
	};

	const refresh = async (refreshToken) => {
		console.log("refreshing token");
		const accessToken = await axios.post(
			"http://localhost:5000/renewAccessToken",
			{ token: refreshToken }
		);
		console.log("accessToken:", accessToken.data.accessToken);
		return accessToken.data.accessToken;
	};

	const hasAccess = async (accessToken) => {
		return axios
			.post(
				"http://localhost:5000/protected",
				{},
				{
					headers: {
						authorization: `Bearer ${accessToken}`,
					},
				}
			)
			.then((res) => {
				return res.data;
			})
			.catch((err) => {
				console.log("err:", err);
				return err;
			});
	};
	//for checking if the user has valid tokens or not
	const protect = async (e) => {
		// console.log("inside");
		let accessToken = Cookies.get("access");
		let refreshToken = Cookies.get("refresh");
		if (!accessToken) {
			setErr("login again");
		} else {
			const isAccess = await hasAccess(accessToken);
			if (isAccess !== "Inside protected route") {
				const accesssReturn = await refresh(refreshToken);
				Cookies.set("access",accesssReturn);
				setErr("protected route accessed");
			}
			setErr("protected route accessed");
		}
	};
	function delete_cookie(name) {
		document.cookie =
			name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
	}
	return (
		<div className="loginForm">
			<div className="form">
				<form action="" onChange={handleChange} onSubmit={handleSubmit}>
					<label htmlFor="email">Email: </label>
					<input type="email" name="email" id="email" />
					<label htmlFor="password">Password: </label>
					<input type="password" name="password" id="password"/>
					<input type="submit" value="Login" />
				</form>
				{err}
				<button onClick={protect}>Access Protected Content</button>

				{/* <button onClick={delete_cookie("refresh")}>Logout</button> */}
			</div>
		</div>
	);
};

export default Login;
