import PacmanLoader from "react-spinners/PacmanLoader";

export default function Searching({ cancelCallback }){
    return (
        <div className="searching">
            <div className="half-transparent-background">
                <div className="background">
                    <p >Searching...</p>
                    <PacmanLoader className="loader" color="#36d7b7"/>
                    <button onClick={cancelCallback} >Cancel</button>
                </div>
            </div>
        </div>
    )
}