import React from "react";
import axios from "axios";
import { useState } from "react";
import codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/theme/darcula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closebrackets";
import { useEffect } from "react";
import { useRef } from "react";
import Auth from "./Auth";
import Headers from "./Headers";
window.onbeforeunload = () => {
	localStorage.clear();
};
// var isInternetConnection = true;
const RequestView = () => {
	const [host, setHost] = useState("");
	const [authorization, setAuthorization] = useState("");
	const [url, setUrl] = useState("");
	const [status, setStatus] = useState("");
	const [method, setMethod] = useState("get");
	const [body, setBody] = useState("");
	const inputRef = useRef(null);
	const outputRef = useRef(null);
	useEffect(() => {
		function initCodeArea() {
			inputRef.current = codemirror.fromTextArea(
				document.getElementById("codeArea"),
				{
					mode: {
						name: "javascript",
						json: true,
					},
					theme: "dracula",
					autoCloseTags: true,
					autoCloseBrackets: true,
					lineNumbers: true,
					autocorrect: true,
					indentWithTabs: true,
					autofocus: true,
				}
			);
			inputRef.current.on("change", (instance, changes) => {
				const inputCode = instance.getValue();
				setBody(inputCode);
				// const { origin } = changes
			});
		}
		function initOutputArea() {
			outputRef.current = codemirror.fromTextArea(
				document.getElementById("outputArea"),
				{
					mode: {
						name: "javascript",
						json: true,
					},
					theme: "dracula",
					autoCloseTags: true,
					autoCloseBrackets: true,
					lineNumbers: true,
					autocorrect: true,
					indentWithTabs: true,
					autofocus: true,
				}
			);
		}

		initCodeArea();
		initOutputArea();

		return () => {};
	}, []);
	const sendRequest = () => {
		setStatus("");
		const baseUrl = `https://restapi-client.herokuapp.com`;
		const Host = url.split("/")[2];
		setHost(Host);
		const bearerToken = localStorage.getItem("Token");
		setAuthorization(bearerToken);
		// default headers config
		// axios.defaults.headers["Accept-Encoding"] = "gzip, deflate, br";
		axios.defaults.headers["Accept-Language"] = "en-US,en;q=0.7";
		axios.defaults.headers["Connection"] = "close";
		axios.defaults.headers["Cache-Control"] = "no-cache";
		axios.defaults.headers["Host"] = Host;
		axios.defaults.headers["Authorization"] = bearerToken || "none";
		axios.defaults.headers["User-Agent"] = "REST Client v1.0.0";
		var requestBody;
		try {
			requestBody = JSON.parse(body);
		} catch (err) {
			requestBody = body;
		}

		if (url.includes("localhost") || url.includes("127.0.0.1")) {
			return axios({
				url,
				method,
				data: requestBody || null,
			})
				.then((result) => {
					console.log(result);
					try {
						setStatus(`🟢 ${result.status} ${result.statusText}`);
						const finalResult = result.data || result.data?.data;
						outputRef.current.setValue(finalResult);
					} catch (err) {
						const finalResult = result.data || result.data?.data;
						outputRef.current.setValue(JSON.stringify(finalResult, null, 2));
					}
				})
				.catch((err) => {
					if (err.message == "Network Error") {
						setStatus(`🔴 ERR_CONNECTION_REFUSED`);
						return outputRef.current.setValue(
							JSON.stringify(
								{
									error: "Connection Refused",
									message: "Network Error / Not Reachable",
								},
								null,
								2
							)
						);
					}
					setStatus(`🔴 ${err.response?.status} ${err.response?.statusText}`);

					outputRef.current.setValue(
						JSON.stringify(
							{
								error: "Cannot perform this request!",
								message:
									err.message ||
									"Provide valid address and specify correct port for localhost!",
							},
							null,
							2
						)
					);
				});
		}

		axios
			.post(`${baseUrl}/handle-${method}`, {
				url,
				data: requestBody || null,
			})
			.then((result) => {
				try {
					setStatus(result.data.status);

					const finalResult = result.data.data;
					outputRef.current.setValue(finalResult);
					setStatus(result.data.status);
				} catch (err) {
					setStatus(result.data?.status || "🔴 ERR_NO_RESPONSE");

					if (err.message.includes("Cannot read")) {
						setStatus("🔴 ERR_NO_RESPONSE");

						return outputRef.current.setValue(
							JSON.stringify(
								{
									error: "Cannot perform this request!",
									message: "DNS address could not be found!",
								},
								null,
								2
							)
						);
					}
					const finalResult = result.data.data;
					outputRef.current.setValue(JSON.stringify(finalResult, null, 2));
				}
			});
	};
	return (
		<div className="px-[10px] overflow-hidden">
			<form className="mx-10 mt-3 flex justify-center gap-2">
				<select
					className="bg-gray-300 px-3 py-1 "
					name=""
					id=""
					onChange={(e) => setMethod(e.target.value.toLowerCase())}
				>
					<option value="GET">GET</option>
					<option value="POST">POST</option>
					<option value="PATCH">PATCH</option>
					<option value="PUT">PUT</option>
					<option value="DELETE">DELETE</option>
				</select>
				<input
					className="bg-gray-300 border border-2 border-gray-600 w-9/12 px-2 py-1"
					type="text"
					onChange={(e) => setUrl(e.target.value)}
					name=""
					id=""
					onKeyDown={(e) => {
						e.key === "Enter" && e.preventDefault();
					}}
				/>
				<button
					type="button"
					className="bg-green-500 text-white px-3 py-2"
					onClick={sendRequest}
				>
					Send
				</button>
			</form>

			<Auth />
			<Headers host={host} authorization={authorization} />
			<div className="flex gap-3 mt-3">
				<div className="min-w-[48vw]">
					<h2 className="mb-2 font-semibold">Body Content</h2>
					<textarea
						id="codeArea"
						className="mt-4 px-4 py-2 mx-10 border border-gray-500 border-2 min-h-[10rem] 
                max-h-auto 
                w-11/12"
					></textarea>
				</div>

				<div className="min-w-[48vw]">
					<div className="flex gap-2  items-center">
						<h2 className="mb-2 font-semibold">Response</h2>
						<div className="ml-6 flex items-center gap-4">
							<p className="-mt-1">{status}</p>
						</div>
					</div>
					<textArea
						id="outputArea"
						className=" px-4 py-2 mx-10 border border-gray-500 border-2 min-h-[30rem] 
                max-h-auto 
                w-11/12 overflow-auto"
					></textArea>
				</div>
			</div>
		</div>
	);
};

export default RequestView;
