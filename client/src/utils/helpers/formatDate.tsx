import moment from "moment";

function formatDate(date: string): string {
	return moment(date).format('MMM D,YYYY')
}

export default formatDate;