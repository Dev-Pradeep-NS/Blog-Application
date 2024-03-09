import { Link } from "react-router-dom"
export function NotFound(){
    return(
        <div>404 Not Found
            <Link to='/register'>Go to home page</Link>
        </div>
    )
}