import logo from '../assets/images/react-logo.png'
import { useContext, useEffect } from 'react'
import Context from './Context'

export default function Header({ setShowAddItem }) {

    const userData = useContext(Context)

    return (
        <nav className="nav-bar">
        <p><a href="/"><img src={logo} alt="logo" height="50" /></a></p>
        <ul>
            <li><a href="/">Home</a></li>
            <li><div onClick={setShowAddItem.bind(this, true)}>Add Item</div></li>
            <li>Hello {userData.name}</li>
            <li>Cart: {userData.cartItems}</li>
        </ul>
        </nav>
    )
}
