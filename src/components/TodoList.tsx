import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { createUserTask, getUserTasks, updateUserTask } from "../slices/todoSlice"
import { TagsForPopUp } from "./TagsForPopUp"
import { TasksForTodo } from "./TasksForTodo"
import { currentFilterType, renderType } from "../pages/todolist/TodoPage"

interface propsInterface {
    tagForFilter: string
    dateForFilter: string
    importantForFilter: 1 | ''
    filterByStatus: ((status: '' | 0 | 1) => void)
    tasksCheck: '' | 0 | 1
    renderTrigger: (() => void)
    currentFilterForView: currentFilterType
    render: renderType
}


export const TodoList: React.FC<propsInterface> = ({tagForFilter, dateForFilter, filterByStatus, tasksCheck, renderTrigger, render, currentFilterForView, importantForFilter}) => {
    const [popUp, setPopUp] = useState<boolean>(false)
    const [taskName, setTaskName] = useState('')
    const [taskDescription, setTaskDescription] = useState('')
    const [taskTags, setTaskTags] = useState<number[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const dispatch = useAppDispatch()
    const todos = useAppSelector(state => state.todo.todos)
    const tags = useAppSelector(state => state.todo.tags)
    const loading = useAppSelector(state => state.todo.loading)
    const pages = useAppSelector(state => Array.from({ length: state.todo.pages }, (_, index) => index + 1))
    const [currentPage, setCurrentPage] = useState<number>(1)


    const popupStyle: Record<string, string> = {
        position:'fixed',
        top:'50%',
        left:'50%',
        transform : 'translate(-50%, -50%)',
    }



    
    const hideComplitedTasks = () => {
        let currentCheck:0|'' = ''
        tasksCheck===''?currentCheck=0:currentCheck=''
        filterByStatus(currentCheck)
        renderTrigger()  
    }

    const showComplitedTasks = () => {
        filterByStatus(1)
        renderTrigger()
    }

    const choiceTagForTodo = (id: number) => {
        if(taskTags.includes(id)){
            const delTag = taskTags.filter(t => t !== id)
            setTaskTags(delTag)
        }else{
            setTaskTags([...taskTags, id])
        } 
    }

    

    const createTask = (e: any) => {
            e.preventDefault();
            dispatch(createUserTask({"name": taskName, 'description': taskDescription, 'tags': taskTags}))
            renderTrigger()
            setPopUp(false)
            setTaskTags([])
    }


    const querySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value: string = e.currentTarget.value
        setSearchQuery(value)
    }

    const popUpToggle = () => {
        setPopUp(!popUp)
        setTaskTags([])
    }

    useEffect(() => {
        const timer = setTimeout(() => dispatch(getUserTasks({page: currentPage, tags: tagForFilter, date: dateForFilter, status: tasksCheck, name: searchQuery, important: importantForFilter})), 500)
        return () => clearTimeout(timer)
    },[searchQuery, render])
    


    return (
        
        <div className="w-full h-full flex flex-col p-10 bg-[#FFFBF5]">
            <div className="grid grid-cols-12">
                <h1 className="text-4xl col-span-3">hello my love</h1>
                <input 
                       onChange={querySearch}
                       value={searchQuery}
                       className="col-span-4 border" 
                       type="text" 
                       placeholder="search" />
            </div>
            <div className="flex flex-col h-full pt-14"> 
                <div className="flex justify-between">
                    <h2 className="text-4xl">{currentFilterForView}</h2>
                    <span className="cursor-pointer hover:text-[#DEC5ED]" onClick={showComplitedTasks}>show all complited task</span>
                </div>

                {!loading?
                    <ul className="grid grid-cols-10 gap-5 pt-10">
                        {todos?todos.map(t => <TasksForTodo key={t.id} task={t}
                                                                        renderTrigger={renderTrigger}
                                                                        />):null}
                        <li onClick={popUpToggle} className="flex flex-col h-48 col-span-5 border rounded-[20px] p-[20px] bg-white">
                            <span>+ add new task</span>
                        </li>
                    </ul>
                : <div className="col-span-10 display flex flex-auto items-center justify-center text-5xl">loading</div>}

                <div className="flex">
                    <input className="cursor-pointer" type="checkbox" checked={tasksCheck===0?true:false} onChange={hideComplitedTasks} /> 
                    <p>Hide done tasks</p>
                </div>
                <div className="flex flex-col mt-auto">
                    <div className="w-full border-t-[1px] border-black pb-5"></div>
                    <ul className="flex justify-end gap-3">
                        {pages?pages.map((p, index) => {

                            const changePage = () => {
                                setCurrentPage(index + 1)
                                renderTrigger()
                            }

                        return <li className="text-xl" key={index} onClick={changePage}>{p}</li>
                        }):null}
                    </ul>
                </div>
            </div>
            {popUp ? 
                <div className="absolute w-full h-full bg-white top-0 left-0 backdrop-blur-3xl pop-up grid grid-cols-10 py-16">
                    <div className="flex flex-col border px-[135px] py-[60px] bg-white rounded-2xl col-start-4 col-span-4">
                    <span className="text-4xl">Add Task</span>
                    <form className="flex flex-col gap-4 pt-4 h-full flex-auto">
                        <label className="flex flex-col text-2xl">
                            title
                            <input onChange={(e: any) => setTaskName(e.currentTarget.value)} value={taskName} className="border " type="text" name="name"/>
                        </label>
                        <label className="flex flex-col text-2xl">
                            description
                            <input onChange={(e: any) => setTaskDescription(e.currentTarget.value)} value={taskDescription} className="border h-64" type="text" name="description" />
                        </label>
                        <ul className="flex gap-5">

                            {tags?tags.map(t => <TagsForPopUp key={t.id} tag={t}
                                                      choiceTagForTodo={choiceTagForTodo}  
                            
                            />):null}
                            
                        </ul>
                        <div className="flex gap-5 ml-auto mt-auto text-2xl">
                        <button onClick={popUpToggle} className="py-3 px-[42px] border rounded-[25px] border-[#764E99] hover:bg-[#764E99]">Cancel</button>
                        <button onClick={createTask} type={"submit"} className="py-3 px-[57px] border rounded-[25px] border-[#764E99] hover:bg-[#764E99]">Add</button>
                        </div>
                    </form>
                </div>
                </div>
            : null
            }                    
        </div> 
        
    )
}