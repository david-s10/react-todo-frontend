import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../utils/axios";


export interface TodoInterface {
    id: number
    name: string
    description: string
    tags?: tagInterface[]
    status: 0 | 1
    important?: 0 | 1,
    created_at: string
}

export interface tagInterface {
    id: number
    name: string
    color?: string
}


interface todoState {
    todo: TodoInterface | undefined
    todos: TodoInterface[]
    tags: tagInterface[] 
    pages: number,
    loading: boolean
    error: null | string
}

const initialState: todoState = {
    todo: undefined,
    todos: [],
    tags: [],
    pages: 1,
    loading : false,
    error: null,
}

export const getUserTags = createAsyncThunk(
    "userboard/getUserBoard", 
    async () => {
        try {
            const response = await instance.get('tag')
            return response.data
        } catch (error: any) {
            console.log(error.response.data)
        }
    }
)

export const createUserTag = createAsyncThunk(
    "userboard/createUserTag",
    async ({name, color} : {name: string, color: string})=>  {
        const FormData = {
            'name': name,
            'color': color
        }
        try {
            const response = await instance.post('tag', FormData)
        } catch (error: any) {
            console.log(error.response.data)
        }
    }
)

export const deleteUserTag = createAsyncThunk(
    "userboard/deleteUserTag",
    async (id: number | undefined ) => {
        try {
            const response = await instance.delete(`tag/${id}/delete`)
            console.log(response.data)
            return response.data
        } catch (error: any) {
            console.log(error.response.data)
        }
    }
)

export const createUserTask = createAsyncThunk(
    "userboard/createTodo",
    async ({name, description, tags = null}: {name: string, description?: string, tags?: number[] | null}) => {
            const headers = {
                'name': name,
                'description': description,
                "tags": tags
            }
        try {
            const response = await instance.post('/task', headers)
            console.log(response.data)
            return response.data
        } catch (error: any) {
            console.log(error.response.data)
        }
    }
)
export const getUserTasks = createAsyncThunk(
    "userboard/getUserTodos",
    async ({page, date, tags, status, name, important} : {page?: number | undefined, date?: string, tags?: string, status?: 1 | 0 | '', name?: string, important?: 1|0|''})=>{

        try {
            const response = await instance.get(`/task?page=${page}&date=${date}&status=${status}&tags=${tags}&name=${name}&important=${important}`)
            console.log(response)
            return response.data
        } catch (error: any) {
            console.log(error.response.data)
        }
    }
)

export const getSingleUserTask = createAsyncThunk(
    "userboard/getSingleUserTodo",
    async (id: string | undefined) => {
        try {
            const response = await instance.get(`/task/${id}`)
            console.log(response.data)
            return response.data
        } catch (error: any) {
            console.log(error.response.data)
        }
    }
)

export const updateUserTask = createAsyncThunk(
    "userboard/updateTodo",
    async ({id, name, description, status, important, tagsToAdd, tagsToRemove}: {id: number, name?: string, description?: string, status?: 0 | 1, important?: 0 | 1, tagsToAdd?: number[], tagsToRemove?: number[]}) => {
        const FormData = {
            'id': id,
            'name': name,
            'description': description,
            'status': status,
            'important': important,
            'tagsToAdd': tagsToAdd,
            'tagsToRemove': tagsToRemove
        }
        try {
            const response = await instance.put('/task/update', FormData)
            console.log(response.data)
            return response.data
        } catch (error: any) {
            console.log(error.response.data)
        }
    }
)

export const deleteUserTask = createAsyncThunk(
    "userboard/deleteTodo",
    async (id: number) => {
        try {
            const response = await instance.delete(`/task/${id}/delete`)
            console.log(response.data)
            return response.data
        } catch (error: any) {
            console.log(error.response.data)
        }
    }
)


export const todoSlice = createSlice({
    name: "todo",
    initialState,
    reducers: {
    
    },
    extraReducers: (builder) => {
        builder.addCase(getUserTags.pending, (state, ) => {
            state.loading = true
        })
        builder.addCase(getUserTags.fulfilled, (state, action) => {
            state.loading = false
            state.tags = action.payload
        })
        builder.addCase(getUserTasks.pending, (state) => {
            state.loading= true
        })
        builder.addCase(getUserTasks.fulfilled, (state, action) => {
            state.loading = false
            state.todos = action.payload.data
            state.pages = action.payload.last_page
        })
        builder.addCase(getSingleUserTask.pending, (state) => {
            state.loading= true
        })
        builder.addCase(getSingleUserTask.fulfilled, (state, action) => {
            state.loading = false
            state.todo = action.payload
        })
        
    }
})


export default todoSlice.reducer