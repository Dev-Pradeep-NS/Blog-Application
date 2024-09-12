import { SocialIcon } from 'react-social-icons'

const NavBar = () => {
	return (
		<div className="flex flex-row items-center my-2 justify-between">
			<div className="basis-3/4 flex flex-row items-center">
				<h1 className="text-2xl font-semibold ">Pradeep Blogs</h1>
				<h2 className='mx-3'>LATEST</h2>
				<h2 className='mx-3'>TRENDING</h2>
				<div className="font-bold text-orange">|</div>
				<h2 className='mx-3'>CONTACT US</h2>
			</div>
			<div className="flex flex-row items-center justify-around basis-1/4">
				<SocialIcon url='www.facebook.com' style={{ height: 40, width: 40, margin: '0 1px' }} />
				<SocialIcon url='www.linkedin.com' href='https://in.linkedin.com/' style={{ height: 40, width: 40, margin: '0 1px' }} />
				<SocialIcon url='www.github.com' style={{ height: 40, width: 40, margin: '0 1px' }} />
				<SocialIcon url='www.instagram.com/' style={{ height: 40, width: 40, margin: '0 1px' }} />
				<button type="button" className='font-light border-green bg-white border py-2 px-3 rounded-lg text-green hover:text-orange'>Follow</button>
			</div>
		</div>
	)
}
export default NavBar;