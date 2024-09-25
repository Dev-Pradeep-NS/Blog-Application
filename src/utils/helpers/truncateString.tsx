function truncateString(str: string) {
	if (str.length > 90) {
		return `${str.substring(0, 90)}...`;
	}
	return str;
}

export default truncateString;