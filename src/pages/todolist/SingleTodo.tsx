import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { TodoInterface, getSingleUserTask } from "../../slices/todoSlice"



export const SingleTodoPage = () => {
    const {id} = useParams()
    const dispatch = useAppDispatch()
    const todo = useAppSelector(state => state.todo.todo)

    useEffect(()=>{
        dispatch(getSingleUserTask(id))
        
    },[])

    return (
        <>
        {todo?<div className="container flex flex-col mx-auto">
            <h1>{todo.name}</h1>

            </div>:null}
        </>
    )

}