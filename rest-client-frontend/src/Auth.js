import React from "react";

const Auth = () => {
	const storeToken = (e) => {
		const token = e.target.value;
		localStorage.setItem("Token", `Bearer ${token}`);
		if (token.length === 0) {
			console.log("clearing...");
			localStorage.clear();
		}
	};
	return (
		<div className="flex justify-center gap-3 mt-5">
			<h2>Bearer Token</h2>
			<input
				onPasteCapture={storeToken}
				onChange={storeToken}
				className="bg-gray-300 w-9/12 px-3 py-1"
				type="text"
				name="token"
				id=""
			/>
		</div>
	);
};

export default Auth;
