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
import ReadingList from "./pages/posts/components/ReadingList";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ProfilePage from "./pages/profile";
import ContactUs from "./pages/contact";
import HomePage from "./pages/home";

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Router>
				<AuthProvider>
					<div className="App font-heading">
						<Routes>
							<Route path="/login" element={<Login />} />
							<Route path="/forgot-password" element={<ForgotPassword />} />
							<Route path="/register" element={<Register />} />
							<Route path="/contact-us" element={<ContactUs />} />
							<Route path="/" element={<HomePage />} />
							<Route path="/:username/:slug" element={<PrivateRoute><ViewPost /></PrivateRoute>} />
							<Route path="/category/:category" element={<PrivateRoute><LatestPosts /></PrivateRoute>} />
							<Route path="/new-story" element={<PrivateRoute><PostForm /></PrivateRoute>} />
							<Route path="/posts" element={<PrivateRoute><Posts /></PrivateRoute>} />
							<Route path="/reading-list" element={<PrivateRoute><ReadingList /></PrivateRoute>} />
							<Route path="/:username" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
						</Routes>
					</div>
				</AuthProvider>
			</Router>
		</QueryClientProvider>
	);
}

export default App;