import { HTMLAttributes, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { changeUser, logout } from "../slices/userSlice"
import instance, { IMAGE_BASE_URL } from "../utils/axios"
import { createUserTag, deleteUserTag, getUserTags } from "../slices/todoSlice"
import { TagsForUserTags } from "./TagsForUserTags"
import { currentFilterType } from "../pages/todolist/TodoPage"
import list from '../images/list.png'
import starList from '../images/star_list.png'
import checkSquare from '../images/check-square.png'
import calendar from '../images/calendar.png'
import edit from '../images/edit.png'

interface propsInterface {
    filterByTag: ((tag: string)=> void)
    filterByDate: ((date: string)=> void)
    filterByStatus: ((status: '') => void)
    choiseFilterForView: ((filter: currentFilterType)=> void)
    currentFilterForView: currentFilterType
    filterByImportant: ((important: 1 | '') => void)
    renderTrigger: (() => void)
}


export const Sidebar: React.FC<propsInterface> = (props) => {
    const [dropDownForAddTag, setDropDownForAddTag] = useState(false)
    const [colorForCreatedTag, setColorForCreatedTag] = useState<string>('#DEC5ED')
    const [nameForCreatedTag, setNameForCreatedTag] = useState<string>('')
    const [countTodayTasks, setCountTodayTasks] = useState()
    const [countAllTasks, setCountAllTasks] = useState()
    const [countImportantTasks, setCountImportantTasks] = useState()
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.user.authUser)
    const tags = useAppSelector(state => state.todo.tags)

    const classesForFilter = (value: string) => {
       if(value === props.currentFilterForView){
            return "grid grid-cols-12 py-2 px-5 cursor-pointer bg-[#DEC5ED] rounded-xl"
       }else{
            return "grid grid-cols-12 py-2 px-5 cursor-pointer"
       }

    }

    const changeAvatar = (e: any) => {
        const target = e.target.files[0]
        dispatch(changeUser(target))
        props.renderTrigger()
    }

    const createList = () => {
        console.log(colorForCreatedTag)
        dispatch(createUserTag({"name": nameForCreatedTag, "color": colorForCreatedTag}))
        props.renderTrigger()
    }

    const getCurrentDate = () => {
        const date = new Date()
        const year = String(date.getFullYear())
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const currentDate = `${year}-${month}-${day}`
        return currentDate
    }

    const getTodayTasks = () => {
        const currentDate = getCurrentDate()
        props.choiseFilterForView('Today')
        props.filterByDate(currentDate)
        props.renderTrigger()
    }


    const getAllTasks = () => {
        props.filterByDate('')
        props.filterByTag('')
        props.filterByStatus('')
        props.filterByImportant('')
        props.choiseFilterForView('All')
        props.renderTrigger()
    }

    const getImportantTasks = () => {
        props.filterByImportant(1)
        props.choiseFilterForView('Important')
        props.renderTrigger()
    }

    const countTasks = {
        today: async () => {
            const currentDate = getCurrentDate()
            const response = await instance.get(`task/?date=${currentDate}`)
            setCountTodayTasks(response.data.total)
        },
        all: async () => {
            const response = await instance.get(`task`)
            setCountAllTasks(response.data.total)  
        },
        important: async () => {
            const response = await instance.get(`task?important=${1}`)
            setCountImportantTasks(response.data.total) 
        }
    }


    useEffect(()=> {
        countTasks.all()
        countTasks.today()
        countTasks.important()
        dispatch(getUserTags())
    },[props.renderTrigger])


    return(
        <>
        {user?
        <div className="side-bar flex flex-col h-full pb-10 w-[300px]">
            <div className="pl-10 py-8 bg-[#DEC5ED] rounded-e-[20px] rounded-es-[20px] flex gap-5">
                <label>
                <img className="w-16 h-16 rounded-full" src={`${IMAGE_BASE_URL}${user.image}`} alt="avatar" />
                <input onChange={changeAvatar} className="hidden" name="image" type="file" />
                </label>
                <span className="text-xl">{user.name}</span>
            </div>
            <div className="px-5 pt-16">
                <div className="pl-5 pb-7">
                    <p className="mb-4">TASKS</p>
                    <ul className="flex flex-col gap-y-5">
                        <li onClick={getTodayTasks} className={classesForFilter("Today")}>
                            <img src={list} alt="list" className="col-span-2" />
                            <span className="ml-5 col-span-7 col-start-3">Today</span>
                            <span className="bg-[#FFFBF5] col-span-2 col-start-11 text-center">{countTodayTasks}</span>
                        </li>
                        <li onClick={getAllTasks} className={classesForFilter("All")}>
                        <img src={checkSquare} alt="list" className="col-span-2" />
                            <span className="ml-5 col-span-7 col-start-3">All Tasks</span>
                            <span className="bg-[#FFFBF5] col-span-2 col-start-11 text-center">{countAllTasks}</span>
                        </li>
                        <li onClick={getImportantTasks} className={classesForFilter("Important")}>
                            <img src={starList} alt="list" className="col-span-2" />
                            <span className="ml-5 col-span-7 col-start-3">Important</span>
                            <span className="bg-[#FFFBF5] col-span-2 col-start-11 text-center">{countImportantTasks}</span>
                        </li>
                    </ul>
                </div>
                <div className="bg-gray-500 w-full h-[1px]" ></div>
                <div className="pt-8 pl-5">
                    <span>LISTS</span>
                    <ul className="pt-8  gap-y-5 flex flex-col">
                        {tags?tags.map(t => <TagsForUserTags key={t.id} 
                                                             tag={t}
                                                             filterByTag={props.filterByTag}
                                                             
                                                             renderTrigger={props.renderTrigger}/> )
                            :null}
                            <li className="flex gap-x-2">
                                {/* <div className="w-5 h-5 rounded-md bg-stone-500"></div> */}
                                <img src={edit} alt="" />
                                <div className="relative select-none">
                                    <span onClick={() => setDropDownForAddTag(!dropDownForAddTag)} 
                                          className={`cursor-pointer ${dropDownForAddTag?'text-orange-400':null}`}>Add new list</span>
                                    {dropDownForAddTag?
                                        <div className="absolute top-10 -left-10">
                                            <div className="flex">
                                                <input onChange={(e) => setColorForCreatedTag(e.currentTarget.value)} className="w-6 h-6 rounded-full" type="color" value={colorForCreatedTag} />
                                                <input onChange={(e) => setNameForCreatedTag(e.currentTarget.value)} type="text" placeholder="tag name" value={nameForCreatedTag}/>
                                            </div>
                                            <button onClick={createList} className="hover:text-orange-400">create</button>
                                        </div>
                                    :null}
                                </div>
                            </li>
                    </ul>
                    
                </div>
            </div>
            <p className="mt-auto mx-auto cursor-pointer hover:text-orange-400" onClick={() => dispatch(logout())}>logout</p>
        </div>
        :null}
        </>
    )
}