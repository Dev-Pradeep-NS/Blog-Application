import moment from "moment";

function formatDate(date: string): string {
	return moment(date).format('MMM D')
}

export default formatDate;