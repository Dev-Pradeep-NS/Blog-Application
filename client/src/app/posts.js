async function getPosts(token) {
    try {
        const response = await fetch(`http://localhost:9292/user/posts?an_token=${token}`);
        if (!response.ok) {
            throw new Error('Network Response is not ok');
        }
        const data = (await response).json();
        console.log('data :>> ', data);
        return data;
    } catch (error) {
        console.log('error :>> ', error);
        throw error;
    }
}

export default function Posts() {
    const posts = async () => {
        const token = localStorage.getItem('an_token');
        const response = await getPosts(token);
        console.log('response :>> ', response);
    }

    return (
        <div>
            <button onClick={posts}>Get Posts</button>
        </div>
    )
}
