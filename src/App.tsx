import { Outlet } from "react-router";
import { Button } from "./components/ui/button";

function App() {
	return (
		<>
			<div>
				<h1 className="text-2xl">This is phovia tour </h1>
				<Button>Button</Button>
				<Outlet />
			</div>
		</>
	);
}

export default App;
