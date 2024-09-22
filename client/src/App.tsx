import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./utils/hooks/AuthContext";
import { QueryClient, QueryClientProvider } from "react-query";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Posts from "./pages/posts";
import ViewPost from "./pages/posts/components/ViewPost";
import PostForm from "./pages/posts/components/AddPost";

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Router>
				<AuthProvider>
					<div className="App font-cas">
						<Routes>
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />
							<Route path="/new-story" element={<PostForm />} />
							<Route path="/" element={<Posts />} />
							<Route path="/:username/:slug" element={<ViewPost />} />
						</Routes>
					</div>
				</AuthProvider>
			</Router>
		</QueryClientProvider>
	);
}

export default App;
