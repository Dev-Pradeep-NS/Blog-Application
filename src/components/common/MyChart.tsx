import React from 'react'
import type { AxisOptions } from 'react-charts'
import { Chart } from 'react-charts'
import { usePostStore } from '../../store';
import NavBar from './NavBar';

type MyDatum = {
	primary: number;
	posts: number;
	user?: {
		avatar_url: string;
		username: string;
		email: string;
		bio: string;
		created_at: string;
	};
}

function MyChart() {
	const postData = usePostStore();
	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();

	const users = [...new Set(postData.postData.map(post => post.user.username))];

	const data = users.map((username) => {
		return {
			label: username,
			data: Array.from({ length: 12 }, (_, month) => {
				const postsInMonth = postData.postData.filter(post => {
					const postDate = new Date(post.created_at);
					return postDate.getMonth() === month && postDate.getFullYear() === currentYear && post.user?.username === username;
				});

				const user = postData.postData.find(post => post.user?.username === username)?.user;

				return {
					primary: month,
					posts: postsInMonth.length,
					user: user
				};
			}),
		};
	});

	const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	const primaryAxis = React.useMemo<AxisOptions<MyDatum>>(() => ({
		getValue: (datum) => datum.primary,
		max: 11,
		tickCount: 12,
		formatters: {
			scale: (value: number) => monthNames[value],
		},
	}), []);

	const secondaryAxes = React.useMemo<AxisOptions<MyDatum>[]>(() => [{
		getValue: (datum) => datum.posts,
		elementType: 'line',
	}], []);

	const generateColorPalette = (n: number) => {
		const baseColors = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c'];
		const palette = [];
		for (let i = 0; i < n; i++) {
			if (i < baseColors.length) {
				palette.push(baseColors[i]);
			} else {
				palette.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
			}
		}
		return palette;
	};
	return (
		<div className='container mx-auto mb-6 sm:mb-10 px-2 sm:px-4 md:px-6 lg:px-8 max-w-screen-lg'>
			<NavBar />
			<div style={{
				width: '100%',
				maxWidth: '800px',
				height: 'auto',
				minHeight: '400px',
				margin: '50px auto',
				boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
				borderRadius: '8px',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				padding: '20px',
				boxSizing: 'border-box',
			}}>
				<h2 style={{ fontSize: 'clamp(1rem, 4vw, 1.5rem)', textAlign: 'center', marginBottom: '10px' }}>Specwise Blogs {new Date().getFullYear()} Yearly Stats</h2>
				<p style={{ fontSize: 'clamp(0.8rem, 2vw, 1rem)', textAlign: 'center', marginBottom: '20px' }}>
					This chart shows the number of posts per month for each user.
				</p>
				<div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', marginBottom: '20px', flexWrap: 'wrap' }}>
					<div style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)', margin: '5px' }}>
						<strong>Total Users:</strong> {users.length}
					</div>
					<div style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)', margin: '5px' }}>
						<strong>Total Posts:</strong> {postData.postData.length}
					</div>
				</div>
				<div style={{ width: '100%', height: '100%', minHeight: '300px' }}>
					<Chart
						options={{
							data,
							primaryAxis,
							secondaryAxes,
							tooltip: {
								render: ({ focusedDatum }) => (
									<div style={{
										background: 'white',
										padding: '10px',
										border: '1px solid #ddd',
										borderRadius: '4px',
										fontSize: 'clamp(0.75rem, 2vw, 1rem)',
									}}>
										<div><strong>Posts:</strong> {focusedDatum?.originalDatum.posts}</div>
										<div><strong>User:</strong> {focusedDatum?.originalDatum.user?.username}</div>
									</div>
								)
							},
							getDatumStyle: (datum) => ({
								circle: {
									r: `${Math.max(datum.originalDatum.posts * 2, 5)}px`,
									fill: '#3498db',
								} as React.CSSProperties,
							}),
							defaultColors: generateColorPalette(users.length),
						}}
					/>
				</div>
			</div>
		</div>
	)
}

export default MyChart;
