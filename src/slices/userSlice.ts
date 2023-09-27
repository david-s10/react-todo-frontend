import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import instance from "../utils/axios";

interface userInterface {
    id: number,
    name: string,
    email: string,
    image?: string
}

interface userState {
    authUser: userInterface | null
    users: userInterface | userInterface[]
    loading: boolean
    error: {} | null
    auth: boolean
}

interface registerInterface {
    "name"?: string
    "email": string
    "password": string
    "password_confirmation"?: string
}

export const registerUser = createAsyncThunk(
    'user/regusterUser',
    async (registerData: registerInterface, {rejectWithValue}) => {
        try {
            const responce = await instance.post('auth/register', registerData)
            console.log(responce)
            return responce.data
        } catch (error: any) {
            console.log(error.response.data.message)
            return rejectWithValue(error.response.data.errors)
        }
    }
)

export const loginUser = createAsyncThunk(
    'user/loginUser',
    async (loginData: registerInterface,) => {
        try {
            const responce = await axios.post('http://127.0.0.1:8000/api/auth/login', loginData)
            console.log(` TOKEN: ${responce.data.token}`)
            localStorage.setItem("TOKEN", responce.data.token)
            return responce.data.token
        } catch (error: any) {
            console.log(error.responce)
        }
    }
)

export const authUser = createAsyncThunk(
    'user/authUser',
    async (_, {rejectWithValue}) => {
        try {
            console.log(localStorage.getItem('TOKEN'))
            const response = await instance.get('user')
            console.log(response.data)
            return await response.data
        } catch (error: any) {
            console.log(error)
            return rejectWithValue(error.responce)
        }
    }
)


export const changeUser = createAsyncThunk(
    'user/changeUser',
    async (image: any) => {
        const formData = new FormData();
        formData.append('image', image);
        console.log(image)
        try {
            const response = await instance.post('user', formData)
            console.log(response.data)
            return response.data

        } catch (error: any) {
            console.log(error.response.data)
        }
    }
)

const initialState: userState = {
    authUser: null,
    users: [],
    loading: false,
    error: null,
    auth: false
    
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logout: (state) => {
            window.localStorage.removeItem('TOKEN')
            state.auth = false
        } 
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state, action) => {
            state.loading = true
            state.error = null;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false
        })
        .addCase(registerUser.rejected, (state, action)=>{
            // state.error = action.payload
        })
        .addCase(loginUser.pending, (state, action) => {
            state.loading = true
            state.error = null
            state.auth = true
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false
        })
        .addCase(authUser.fulfilled, (state, action) => {
            state.authUser = action.payload
            state.auth = true
        })
        .addCase(authUser.rejected, (state, action) => {
            state.auth = false
            state.authUser = null
        })
    }
})

export const { logout } = userSlice.actions
export default userSlice.reducer