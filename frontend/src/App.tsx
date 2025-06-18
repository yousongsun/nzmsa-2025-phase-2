import { useState } from "react";
import viteLogo from "/vite.svg";
import reactLogo from "./assets/react.svg";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<div className="flex justify-center space-x-4">
				<a href="https://vite.dev" target="_blank" rel="noopener">
					<img src={viteLogo} className="w-16 h-16" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank" rel="noopener">
					<img src={reactLogo} className="w-16 h-16" alt="React logo" />
				</a>
			</div>
			<h1 className="text-2xl font-bold text-center mt-4">Vite + React</h1>
			<div className="card mt-6 text-center">
				<button
					type="button"
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					onClick={() => setCount((count) => count + 1)}
				>
					count is {count}
				</button>
				<p className="mt-4 text-gray-600">
					Edit{" "}
					<code className="font-mono bg-gray-100 px-1 py-0.5 rounded">
						src/App.tsx
					</code>{" "}
					and save to test HMR
				</p>
			</div>
			<p className="read-the-docs mt-6 text-center text-gray-500">
				Click on the Vite and React logos to learn more
			</p>
		</>
	);
}

export default App;
