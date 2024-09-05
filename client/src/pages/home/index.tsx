import React from "react";

const HomePage = () => {
	return (
		<div className="mx-10 my-5 font-cas">
			<div className="flex flex-row justify-between items-center">
				<div className="flex flex-row justify-start items-center basis-1/2">
					<h1 className="text-black text-2xl font-bold mr-2">Pradeep</h1>
					<p className="font-light">Open in app</p>
				</div>
				<div className="flex flex-row justify-end items-center basis-1/2">
					<a href="" className="font-semibold text-green mr-2">Sign in</a>
					<button className="bg-white border rounded-lg px-4 py-2 border-green text-black hover:text-orange">
						Button
					</button>
				</div>
			</div>
			<div className="flex flex-row justify-between items-center my-2">
				<div className="basis-3/4 flex flex-row items-center justify-between">
					<h1 className="text-3xl font-semibold">Pradeep Blogs</h1>
					<h2>PRODUCT NEWS</h2>
					<h2>LATEST</h2>
					<h2>NEWSLETTER</h2>
				</div>
				<div className="justify-end">
					<p>Intagram</p>
				</div>
			</div>
		</div>
	)
}
export default HomePage;