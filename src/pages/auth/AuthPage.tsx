import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginUser, registerUser } from "../../slices/userSlice";
import { Link } from "react-router-dom";

export const AuthPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [conPassword, setConPassword] = useState("");
    const error = useAppSelector(state => state.user.error)
    const location = useLocation()
    const navigate = useNavigate()


    const dispatch = useAppDispatch()
    const postRegistration = {
        "name": username.trim(),
        "email": email.trim().toLowerCase(),
        "password": password,
        "password_confirmation": conPassword
    }
    
    const postLogin = {
      "email": email.trim().toLowerCase(),
      "password": password,
      // "email": 'david@gmail.com',
      // "password": '123123123',
    }

    const registration = (e: any) => {
      e.preventDefault()
      dispatch(registerUser(postRegistration))
      console.log(error)
    }

    const login = (e: any) => {
      e.preventDefault()
      dispatch(loginUser(postLogin))
      navigate('/')
    }

      return(
        <div className="form-wrapper h-full flex">
        <form className="flex flex-col items-center gap-3 pt-7 m-auto bg-slate-500 opacity-50 w-96 h-96">
          <Link to="/">home</Link>
        {/* {error?error.map((e: any) => <span>{e}</span>):''} */}
        {location.pathname === '/registration'?<h1 className="text-center">registration</h1>: null}
        {location.pathname === '/login'?<h1 className="text-center">login</h1>: null}
        {location.pathname === '/registration'?<input type="text" value={username} onChange={e => setUsername(e.currentTarget.value)} name="name" placeholder="username"/>:null}
        <input type="text" value={email} onChange={e => setEmail(e.currentTarget.value)} name="email" placeholder="email"/>
        <input type="text" value={password} onChange={e => setPassword(e.currentTarget.value)} name="password" placeholder="password"/>
        {location.pathname === '/registration'?<input type="text" value={conPassword} onChange={e => setConPassword(e.currentTarget.value)} name="password_confirmation" placeholder="password_confirmation"/>:null}
        {location.pathname === '/registration'?<button type={"submit"} onClick={registration}>SignUp</button>: null}
        {location.pathname === '/login'?<button type={'submit'} onClick={login}>LogIn</button>: null}
        <div className="flex mt-auto">
        {location.pathname === '/registration'?
        <>
          <p>already in Todo?</p>
          <Link to="/login">LogIn</Link>
        </>: null}
        {location.pathname === '/login'?
        <>
          <p>have not Acc?</p>
          <Link to="/registration">SignUp</Link>
        </>: null}
        </div>
      </form>
      </div>
    )
    
}
