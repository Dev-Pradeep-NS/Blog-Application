import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query'
import HomePage from "./pages/posts";
const queryClient = new QueryClient()

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Router>
				<div className="App">
					<Routes>
						<Route path="/" element={<HomePage />} />
					</Routes>
				</div>
			</Router>
		</QueryClientProvider>
	);
}

export default App;
