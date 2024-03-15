import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Register from './user/register';
import Login from './user/login';
import { NotFound } from './user/notFoundPage';
import PostForm from './app/createpost';
import Posts from './app/posts';
import Post from './app/post';

const router = createBrowserRouter([
    {
        path: '/register',
        element: <Register />,
        errorElement: <div>404 not found</div>
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/',
        element: <PostForm />
    },
    {
        path: '/notfound',
        element: <NotFound />
    },
    {
        path: '/posts',
        element: <Posts />
    },
    {
        path: '/post/1',
        element: <Post />
    }
]);


const App = () => {
    return(
        <div><RouterProvider router={router} /></div>
    )
}
export default App;