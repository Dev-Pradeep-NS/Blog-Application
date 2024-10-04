import { useState, useEffect } from "react";
import type React from "react";
import { useAuth } from "../../../utils/hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import '../index.css'
import { useCreatePost } from "../../../utils/hooks/usePosts";
import ReactQuill, { Quill } from "react-quill";
import 'react-quill/dist/quill.snow.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import "react-quill/dist/quill.snow.css";

hljs.configure({
	languages: ['javascript', 'python', 'ruby', 'go', 'typescript', 'java', 'cpp', 'csharp'],
});

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

	const handleContentChange = (value: string) => {
		setContent(value);
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
		<div className="min-h-screen bg-gray-100 font-cas">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white rounded-lg border px-5 py-1">
					<button type="button" onClick={() => navigate("/posts")} className="text-gray-600 hover:text-gray-900 mb-4 sm:mb-0">
						<img src='/Logo.png' alt="Logo" className="h-10 w-10" />
					</button>
					<div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
						<button
							type="button"
							className={`w-full sm:w-auto bg-white text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${!isFormValid && 'opacity-50 cursor-not-allowed'}`}
							onClick={handleSaveDraft}
							disabled={!isFormValid}
						>
							Save Draft
						</button>
						<button
							type="button"
							className={`w-full sm:w-auto bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${!isFormValid && 'opacity-50 cursor-not-allowed'}`}
							onClick={handlePublish}
							disabled={!isFormValid}
						>
							Publish
						</button>
					</div>
				</div>
				<div className="bg-white shadow-lg rounded-lg overflow-hidden">
					<form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3 sm:space-y-4">
						<input
							type="text"
							value={title}
							onChange={handleTitleChange}
							className="w-full text-lg sm:text-base font-bold focus:outline-none placeholder-gray-400 text-gray-900 border-2 border-gray-300 rounded-md p-2"
							placeholder="Title"
							required
						/>

						<textarea
							value={description}
							onChange={handleDescriptionChange}
							className="w-full text-base sm:text-sm focus:outline-none placeholder-gray-400 text-gray-700 resize-none border-2 border-gray-300 rounded-md p-2"
							placeholder="Write a brief description..."
							rows={2}
							required
						/>

						<ReactQuill
							value={content}
							onChange={handleContentChange}
							className="h-auto font-sans"
							placeholder="Tell your story..."
							modules={{
								toolbar: [
									['bold', 'italic', 'underline', 'strike', 'blockquote'],
									[{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
									['link', 'image'],
									['code-block'],
									['clean']
								],
								syntax: true,
								clipboard: {
									matchVisual: false
								}
							}}
							formats={[
								'bold', 'italic', 'underline', 'strike', 'blockquote',
								'list', 'bullet', 'indent',
								'link', 'image',
								'code-block'
							]}
							theme="snow"
							style={{ minHeight: "200px" }}
						/>

						<div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
							<select
								value={category}
								onChange={handleCategoryChange}
								className="w-full sm:w-1/2 px-2 py-1.5 text-sm text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
								className="w-full sm:w-1/2 px-2 py-1.5 text-sm text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
								placeholder="Tags (comma-separated)"
								required
							/>
						</div>

						<div>
							<label htmlFor="file-upload" className="block text-xs font-medium text-gray-700 mb-1">
								Featured Image
							</label>
							<div className="mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-gray-300 border-dashed rounded-md">
								<div className="space-y-1 text-center">
									{selectedFile ? (
										<div>
											<img
												src={URL.createObjectURL(selectedFile)}
												alt="Preview"
												className="mx-auto h-24 w-auto"
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
												className="mt-2 px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
											>
												Remove
											</button>
										</div>
									) : (
										<>
											<svg className="mx-auto h-10 w-10 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
												<path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
											</svg>
											<div className="flex text-xs text-gray-600">
												<label
													htmlFor="file-upload"
													className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
												>
													<span>Upload a file</span>
													<input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
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