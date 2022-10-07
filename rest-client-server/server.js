const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const axios = require("axios");
const httpException = require("http-errors");
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
	return res.json({
		data: {
			test: "OK",
		},
	});
});

app.post("/handle-get", async (req, res) => {
	try {
		const url = req.body.url;
		const response = await axios.get(url, {
			headers: {
				Authorization: req.headers.authorization,
			},
		});
		return res.json({
			data: response.data,
			status: `🟢 ${response.status} ${response.statusText}`,
		});
	} catch (err) {
		if (err.code == "ENOTFOUND") {
			return res.json({
				data: {
					error: `DNS address could not be found! ${err.message}`,
				},
			});
		}
		return res.json({
			data: err.response?.data,
			status: `🔴 ${err.response?.status} ${err.response?.statusText}`,
		});
	}
});
app.post("/handle-post", async (req, res) => {
	try {
		let { url, data } = req.body;

		const response = await axios.post(url, data, {
			headers: {
				Authorization: req.headers.authorization,
			},
		});
		return res.json({
			data: response.data,
			status: `🟢 ${response.status} ${response.statusText}`,
		});
	} catch (err) {
		if (err.code == "ENOTFOUND") {
			return res.json({
				data: {
					error: `DNS address could not be found! ${err.message}`,
				},
			});
		}
		return res.json({
			data: err.response?.data,
			status: `🔴 ${err.response?.status} ${err.response?.statusText}`,
		});
	}
});
app.post("/handle-patch", async (req, res, next) => {
	try {
		const { url, data } = req.body;

		const response = await axios.patch(url, data, {
			headers: {
				Authorization: req.headers.authorization,
			},
		});
		return res.json({
			data: response.data,
			status: `🟢 ${response.status} ${response.statusText}`,
		});
	} catch (err) {
		if (err.code == "ENOTFOUND") {
			return res.json({
				data: {
					error: `DNS address could not be found! ${err.message}`,
				},
			});
		}
		return res.json({
			data: err.response?.data,
			status: `🔴 ${err.response?.status} ${err.response?.statusText}`,
		});
	}
});
app.post("/handle-put", async (req, res, next) => {
	try {
		const { url, data } = req.body;
		const response = await axios.put(url, data, {
			headers: {
				Authorization: req.headers.authorization,
			},
		});
		return res.json({
			data: response.data,
			status: `🟢 ${response.status} ${response.statusText}`,
		});
	} catch (err) {
		if (err.code == "ENOTFOUND") {
			return res.json({
				data: {
					error: `DNS address could not be found! ${err.message}`,
				},
			});
		}
		return res.json({
			data: err.response?.data,
			status: `🔴 ${err.response?.status} ${err.response?.statusText}`,
		});
	}
});
app.post("/handle-delete", async (req, res, next) => {
	try {
		const { url } = req.body;
		const response = await axios.delete(url, {
			headers: {
				Authorization: req.headers.authorization,
			},
		});
		return res.json({
			data: response.data,
			status: `🟢 ${response.status} ${response.statusText}`,
		});
	} catch (err) {
		if (err.code == "ENOTFOUND") {
			return res.json({
				data: {
					error: `DNS address could not be found! ${err.message}`,
				},
			});
		}
		return res.json({
			data: err.response?.data,
			status: `🔴 ${err.response?.status} ${err.response?.statusText}`,
		});
	}
});

app.use((req, res, next) => {
	const error = httpException.NotFound("Page not found!");
	next(error);
});
app.use((err, req, res, next) => {
	res.status(err.status || 500);

	return res.json({
		error: {
			status: err.status,
			message: err.message || "Internal Server Error!",
		},
	});
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
