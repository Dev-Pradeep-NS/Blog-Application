import NavBar from "../../components/common/NavBar";
import CategoryPosts from "./components/CategoryPosts";

const LatestPosts = () => {
	return (
		<div className="container mx-auto mb-6 sm:mb-10 px-2 sm:px-4 md:px-6 lg:px-8 max-w-screen-lg">
			<NavBar />
			<CategoryPosts />
		</div>
	)
}
export default LatestPosts;