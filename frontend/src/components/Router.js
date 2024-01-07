import Header from './Header'
import Footer from './Footer'
import Home from '../pages/Home'
import Contact from '../pages/Contact'
import ProductDetails from '../pages/ProductDetails'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { useState } from 'react'
import AddItem from '../pages/AddItem'
// import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'

export default function Router() {
    const [showAddItem, setShowAddItem] = useState(false)


    return (
        <>
            {showAddItem && <AddItem setShowAddItem={setShowAddItem}></AddItem>}
            <Header setShowAddItem={setShowAddItem}/>
            <div className="content"><Home /></div>
        </>
    )
}