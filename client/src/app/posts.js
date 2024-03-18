import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom";

const PostData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPost();
    }, []);

    const fetchPost = async () => {
        const token = localStorage.getItem('an_token');
        try {
            const response = await fetch(`http://localhost:9292/user/posts?an_token=${token}`);
            if (!response.ok) {
                throw new Error("Response is not Ok");
            }
            const data = await response.json()
            setData(data)
            setLoading(false);
            console.log('data :>> ', data);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <div>
            {loading ? (
                <p>Loading....</p>
            ) :
                error ? (
                    <p>Error: {error}</p>
                ) : (
                    <ul>
                        {data.values.map((item) => (
                            <li key={item.id}>
                                <img src={item.image_url} alt="" />
                                <Link to={`/post/${item.id}`}>{item.title}</Link>
                                <p>{item.content}</p>
                            </li>
                        ))}
                    </ul>
                )}
        </div>
    )

}
export default PostData;