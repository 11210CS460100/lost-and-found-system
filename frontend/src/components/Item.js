
export default function Item({description, picture, dateLost, locationFound, status, finderName}) {

    return (
        <div className="item">
            <img className="item-picture" src='https://imgur.com/h4aLbCI.jpeg'/>
            <p className="item-dateLost">Lost date: {dateLost}</p>
            <p className="item-locationFound">Location Found: {locationFound}</p>
            <p className="item-status">Status: {status}</p>
            <p className="item-finderName">Finder: {finderName}</p>
            <p className="item-description">Description: {description}</p>
        </div>
    )
}