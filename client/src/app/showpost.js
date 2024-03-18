// Post.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Post() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPost(id);
    }, [id]);

    const fetchPost = async (id) => {
        const token = localStorage.getItem('an_token');
        try {
            const response = await fetch(`http://localhost:9292/user/posts/${id}?an_token=${token}`);
            if (!response.ok) {
                throw new Error("Response is not Ok");
            }
            const responseData = await response.json();
            if (responseData && responseData.values && responseData.values.length > 0) {
                setPost(responseData.values[0]);
            } else {
                throw new Error("Post not found");
            }
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading....</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <h1>Title: {post.title}</h1>
            <p>Content: {post.content}</p>
            <p>Category: {post.category}</p>
            <p>Status: {post.status}</p>
            <p>Visibility: {post.visibility}</p>
            <img src={post.image_url} alt="" />
        </div>
    );
}

export default Post;
