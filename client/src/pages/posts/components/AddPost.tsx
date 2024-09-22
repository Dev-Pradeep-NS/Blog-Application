import { useState, useEffect } from "react";
import type React from "react";
import { useAuth } from "../../../utils/hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import '../index.css'
import { useCreatePost } from "../../../utils/hooks/usePosts";

const AddPost: React.FC = () => {
    const server_url = process.env.REACT_APP_SERVER_URL || '';
    const navigate = useNavigate();
    const { token } = useAuth();
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [status, setStatus] = useState<string>("draft");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [category, setCategory] = useState<string>("");
    const [tags, setTags] = useState<string>("");
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const createPostMutation = useCreatePost(server_url, token);

    useEffect(() => {
        const checkFormValidity = () => {
            return (
                title.trim() !== "" &&
                description.trim() !== "" &&
                content.trim() !== "" &&
                category !== "" &&
                tags.trim() !== ""
            );
        };

        setIsFormValid(checkFormValidity());
    }, [title, description, content, category, tags]);

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value);
    };

    const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value);
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(event.target.value);
    };

    const handleTagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTags(event.target.value);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setSelectedFile(file);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const postData = {
            title,
            description,
            content,
            status,
            category,
            tags,
            image: selectedFile || undefined
        };

        createPostMutation.mutate(postData);
    };

    const handlePublish = () => {
        setStatus("published");
        handleSubmit({ preventDefault: () => { } } as React.FormEvent<HTMLFormElement>);
    };

    const handleSaveDraft = () => {
        setStatus("draft");
        handleSubmit({ preventDefault: () => { } } as React.FormEvent<HTMLFormElement>);
    };

    return (
        <div className="mb-10 scrollbar-hide">
            <div className="flex justify-between items-center py-4 px-6 mx-80 mb-5 sticky top-0 z-10">
                <button type="button" onClick={() => navigate("/")} >
                    <img src='/pB.png' alt="Logo" style={{ height: 100, width: 100 }} />
                </button>
                <div className="flex items-center space-x-4">
                    <button
                        type="button"
                        className={`bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium ${!isFormValid && 'opacity-50 cursor-not-allowed'}`}
                        onClick={handleSaveDraft}
                        disabled={!isFormValid}
                    >
                        Save Draft
                    </button>
                    <button
                        type="button"
                        className={`bg-green-100 text-green-600 px-4 py-2 rounded-md text-sm font-medium ${!isFormValid && 'opacity-50 cursor-not-allowed'}`}
                        onClick={handlePublish}
                        disabled={!isFormValid}
                    >
                        Publish
                    </button>
                </div>
            </div>
            <div className="h-auto pb-5 flex justify-center">
                <div className="bg-white shadow-md rounded-lg w-full max-w-3xl">
                    <form onSubmit={handleSubmit} className="p-6 max-h-[calc(95vh-120px)] overflow-y-auto scrollbar-hide">
                        <input
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            className="w-full text-2xl font-bold focus:outline-none placeholder-gray-500 text-gray-900 bg-transparent border border-gray-300 rounded-md p-2"
                            placeholder="Title"
                            required
                        />

                        <textarea
                            value={description}
                            onChange={handleDescriptionChange}
                            className="w-full mt-6 text-xl focus:outline-none placeholder-gray-500 text-gray-900 bg-transparent border border-gray-300 rounded-md p-2"
                            placeholder="Write a brief description..."
                            rows={3}
                            required
                        />

                        <textarea
                            value={content}
                            onChange={handleContentChange}
                            className="w-full mt-6 text-xl focus:outline-none placeholder-gray-500 text-gray-900 bg-transparent border border-gray-300 rounded-md p-2"
                            placeholder="Tell your story..."
                            rows={5}
                            required
                        />

                        <select
                            value={category}
                            onChange={handleCategoryChange}
                            className="w-full mt-6 text-xl focus:outline-none placeholder-gray-500 text-gray-900 bg-transparent border border-gray-300 rounded-md p-2"
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="technology">Technology</option>
                            <option value="lifestyle">Lifestyle</option>
                            <option value="travel">Travel</option>
                            <option value="food">Food</option>
                            <option value="other">Other</option>
                        </select>

                        <input
                            type="text"
                            value={tags}
                            onChange={handleTagsChange}
                            className="w-full mt-6 text-xl focus:outline-none placeholder-gray-500 text-gray-900 bg-transparent border border-gray-300 rounded-md p-2"
                            placeholder="Tags (comma-separated)"
                            required
                        />

                        <div className="mt-4">
                            <label
                                htmlFor="file-upload"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Upload Featured Image
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>

                                    {selectedFile ?
                                        (
                                            <div>
                                                <img
                                                    src={URL.createObjectURL(selectedFile)}
                                                    alt="Preview"
                                                    className="mt-2 max-w-full h-auto"
                                                    style={{ maxHeight: '200px' }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedFile(null);
                                                        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                                                        if (fileInput) {
                                                            fileInput.value = '';
                                                        }
                                                    }}
                                                    className="mt-2 px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ) :
                                        (
                                            <>
                                                <div className="flex text-sm text-gray-600">
                                                    <label
                                                        htmlFor="file-upload"
                                                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                                                    >
                                                        <span>Upload a file</span>
                                                        <input
                                                            id="file-upload"
                                                            name="file-upload"
                                                            type="file"
                                                            className="sr-only"
                                                            onChange={handleImageUpload}
                                                            accept="image/*"
                                                        />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                            </>
                                        )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}; export default AddPost;