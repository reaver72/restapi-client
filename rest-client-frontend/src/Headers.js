import React from "react";
import { useState } from "react";

const Headers = ({ host, authorization }) => {
	const headers = [
		{
			key: "Accept-Encoding",
			value: "gzip, deflate, br",
		},

		{
			key: "Authorization",
			value: authorization ? authorization : "none",
		},
		{
			key: "Cache-Control",
			value: "no-cache",
		},
		{
			key: "Connection",
			value: "close",
		},
		{
			key: "Host",
			value: host ? host : "Determined at runtime",
		},
		{
			key: "User-Agent",
			value: "REST Client v1.0.0",
		},
	];
	return (
		<div className="mt-2 border-4">
			<h2 className="text-center font-semibold">Headers</h2>

			<hr />

			<table className="w-full table-auto">
				<tr className="border-2">
					<th className="border-2">Key</th>
					<th>Value</th>
				</tr>
				{headers.map((item, i) => {
					return (
						<tr key={i}>
							<td className="border-2">
								<input
									className="w-full focus:outline-none px-2 py-1"
									type="text"
									name=""
									id=""
									onChange={(e) => e}
									value={item.key}
								/>
							</td>
							<td className="border-2">
								<input
									className="w-full focus:outline-none px-2 py-1"
									type="text"
									name=""
									id=""
									onChange={(e) => e}
									value={item.value}
								/>
							</td>
						</tr>
					);
				})}
			</table>
		</div>
	);
};

export default Headers;
