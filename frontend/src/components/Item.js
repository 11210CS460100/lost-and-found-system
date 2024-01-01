
export default function Item({description, picture, dateLost, locationFound, status, finderName}) {

    return (
        <div className="item">
            <p className="item-dateLost">Lost date: {dateLost}</p>
            <img className="item-picture" src={require('../assets/images/eat-sleep-code-repeat.jpg')}/>
            <p className="item-locationFound">Location Found: {locationFound}</p>
            <p className="item-status">{status}</p>
            <p className="item-finderName">{finderName}</p>
            <p className="item-description">{description}</p>
        </div>
    )
}