import { Link, Outlet } from "react-router-dom"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { authUser } from "../slices/userSlice"
import { Sidebar } from "./SideBar"

export const Layout = () => {
    const dispatch = useAppDispatch()
    const checkUser = useAppSelector(state => state.user.auth)

    useEffect(()=> {
        dispatch(authUser())
    },[checkUser])


    return(
        <div className="wrapper mx-auto flex flex-col h-full">
        <header className="container flex items-center justify-center gap-3 mx-auto">
            <nav className="flex items-center justify-center gap-3">
            {checkUser?
                    <>
                    <Link to="/">home</Link>
                    <Link to="/about">about</Link>
                    <Link to="/mytodo">myTodo</Link>
                    </>
            :
                    <>
                    <Link to="/registration" >SignUp</Link>
                    <Link to="/login">LogIn</Link>
                    </>
            }
            </nav>
        </header>
        <main className="flex w-full h-full">
        <Outlet/>
        </main>
        <footer className="flex mt-auto items-center justify-center">react + laravel by david.s</footer>
        </div>
        
    )
}