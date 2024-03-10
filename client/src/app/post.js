import React, { useState } from 'react';

async function createPost(data) {
    try {
        const response = await fetch('http://localhost:9292/user/posts/create', {
            method: 'POST',
            body: data,
        });
        return response.json();
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
}

function PostForm() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('');
    const [visibility, setVisibility] = useState('');
    const [category, setCategory] = useState('');
    const [pic, setPic] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const an_token = localStorage.getItem('an_token');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('status', status);
        formData.append('visibility', visibility);
        formData.append('category', category);
        formData.append('pic', pic);
        formData.append('an_token', an_token);

        try {
            const result = await createPost(formData);
            console.log('Post created successfully:', result);
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <div>
            <h2>Create Post</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                    <label>Content:</label>
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} />
                </div>
                <div>
                    <label>Status:</label>
                    <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} />
                </div>
                <div>
                    <label>Visibility:</label>
                    <input type="text" value={visibility} onChange={(e) => setVisibility(e.target.value)} />
                </div>
                <div>
                    <label>Category:</label>
                    <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
                </div>
                <div>
                    <label>pic:</label>
                    <input type="file" onChange={(e) => setPic(e.target.files[0])} />
                </div>
                <button type="submit">Create Post</button>
            </form>
        </div>
    );
}

export default PostForm;
