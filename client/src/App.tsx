import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query'
import Posts from "./pages/posts";
import ViewPost from "./pages/posts/ViewPost";
const queryClient = new QueryClient()

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Router>
				<div className="App">
					<Routes>
						<Route path="/" element={<Posts />} />
						<Route path="/:username/:slug" element={<ViewPost />} />
					</Routes>
				</div>
			</Router>
		</QueryClientProvider>
	);
}

export default App;
