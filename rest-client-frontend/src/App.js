import RequestView from "./RequestView";

function App() {
	return (
		<div className="App">
			<div className="flex justify-start items-center px-8 gap-4 bg-gray-600 py-4">
				<img
					className="w-[50px]"
					src="https://humao.gallerycdn.vsassets.io/extensions/humao/rest-client/0.25.1/1660918934840/Microsoft.VisualStudio.Services.Icons.Default"
					alt=""
				/>
				<h2 className="text-3xl text-white ">REST Client</h2>
				<h2 className="text-lg text-white ">(Make API Calls Online)</h2>
			</div>
			<RequestView />
		</div>
	);
}

export default App;
