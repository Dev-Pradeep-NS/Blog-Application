function readingTime(text: string) {
	const wpm = 225;
	const words = text?.trim().split(/\s+/).length;
	const minutes = Math.ceil(words / wpm);
	return minutes === 1 ? '1 minute' : `${minutes} minutes`;
}

export default readingTime;