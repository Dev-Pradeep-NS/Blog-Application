import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./utils/hooks/AuthContext";
import { QueryClient, QueryClientProvider } from "react-query";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Posts from "./pages/posts";
import ViewPost from "./pages/posts/components/ViewPost";
import PostForm from "./pages/posts/components/AddPost";
import PrivateRoute from "./utils/hooks/PrivateRoute";
import LatestPosts from "./pages/posts/LatestPosts";

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
							<Route path="/" element={<Posts />} />
							<Route path="/:username/:slug" element={<ViewPost />} />
							<Route path="/latest" element={<LatestPosts />} />
							<Route path="/new-story" element={
								<PrivateRoute>
									<PostForm />
								</PrivateRoute>
							} />
						</Routes>
					</div>
				</AuthProvider>
			</Router>
		</QueryClientProvider>
	);
}

export default App;
