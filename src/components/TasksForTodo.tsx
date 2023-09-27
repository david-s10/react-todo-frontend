import { } from "react-redux"
import { TodoInterface, deleteUserTask, getUserTasks, tagInterface, updateUserTask } from "../slices/todoSlice"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import star from '../images/star.png'
import filledStar from '../images/star_filled.png'
import { useSelector } from "react-redux"
import { TagsForDeleteComponent } from "./deleteAddTags/TagsForDelete"
import { TagsForAddComponent } from "./deleteAddTags/TagsForAdd"

interface TasksForTodoProps {
    task: TodoInterface
    renderTrigger: (() => void)
}


export const TasksForTodo: React.FC<TasksForTodoProps> = ( {task, renderTrigger}) => {
    const dispatch = useAppDispatch()
    const [dropdown, setDropDown] = useState(false)
    const [fieldsForChangeTask, setFielfForChangeTask] = useState<boolean>(false)
    const [taskNameField, setTaskNameField] = useState<string>(task.name)
    const [taskDescriptionField, setTaskDescriptionField] = useState<string>(task.description)
    // const [tagsForDelete, setTagsForDelete] = useState<tagInterface[] | undefined>()
    const [tagsForAddFunc, setTagForAddFunc] = useState<number[]>([])
    const [tagsForDeleteFunc, setTagForDeleteFunc] = useState<number[]>([])
    const tagsForFilter = useAppSelector(state => state.todo.tags)

    const chengeStatus = () => {
        const newStatus = task.status===1?0:1
        dispatch(updateUserTask({id: task.id, status: newStatus}))
        renderTrigger()
    }

    const changeImportant = () => {
        const newStatus = task.important===1?0:1
        dispatch(updateUserTask({id: task.id, important: newStatus}))
        renderTrigger()
    }
    const changeTask = () => {
        dispatch(updateUserTask({id: task.id, name: taskNameField, description: taskDescriptionField, tagsToAdd: tagsForAddFunc, tagsToRemove: tagsForDeleteFunc}))
        renderTrigger()
    }
   

    const deleteTask = () => {
        dispatch(deleteUserTask(task.id))
        renderTrigger()
    }

    const showDropDown = () => {
        setDropDown(!dropdown)
    }

    const showFieldsForChange = () => {
        setFielfForChangeTask(!fieldsForChangeTask);
        setTagForDeleteFunc([])
        setTagForAddFunc([])
        setDropDown(false)
    }

    const choiceTagForDelete = (id: number) => {
        if(tagsForDeleteFunc.includes(id)){
            const unChoiceTag = tagsForDeleteFunc?.filter(t => t !== id)
            setTagForDeleteFunc(() => unChoiceTag)
            // setTagsForDelete(task.tags?.filter(s => unChoiceTag.includes(s.id)))
        }else{
            setTagForDeleteFunc(() => [...tagsForDeleteFunc, id])
            
        } 
    }

    const choiceTagForAdd = (id: number) => {
        if(tagsForAddFunc.includes(id)){
            const unChoiceTag = tagsForAddFunc?.filter(t => t !== id)
            setTagForAddFunc(() => unChoiceTag)
        }else{
            setTagForAddFunc(() => [...tagsForAddFunc, id])
        } 
        // console.log(tagsForAddFunc)
    }

    // useEffect(()=>{

        // if(task.tags){
        //     setTagsForDelete([])
        //     const tags = task.tags.map(t => t.id)
        //     const filteredTags = tagsForFilter.filter(t =>  !tags.includes(t.id))
        //     setTagsForDelete(filteredTags)
        // }
        // setTagsForDelete(() => {
        //     if(task.tags){
        //         const tags = task.tags.map(t => t.id)
        //         const filteredTags = tagsForFilter.filter(t =>  !tags.includes(t.id))
        //         return filteredTags
        //     }
        // })
    // },[renderTrigger])

    const classesForTask = {
        TASK_WRAPPER: `flex flex-col h-48 col-span-5 border rounded-[20px] p-[20px] bg-white ${task.status?'line-through opacity-50':null}`,
        TASK_WRAPPER_TOP: `flex items-center`,
        TASK_IMPORTANT: `mr-5`,
        TASK_DROPDOWN: `ml-auto relative cursor-pointer select-none no-underline opacity-1`,
        TASK_TITLE: `text-2xl`,
        TASK_DESCRIPTION: `text-xl mt-5`,
    }


    return !fieldsForChangeTask ? 
    
    <li className={classesForTask.TASK_WRAPPER} >

        <div className={classesForTask.TASK_WRAPPER_TOP}>
            <img onClick={changeImportant} src={task.important?filledStar:star} alt="star" className={classesForTask.TASK_IMPORTANT} />
            
            <Link to={`/mytodo/${String(task.id)}`} className="text-3xl">{task.name}</Link>

            <div className={classesForTask.TASK_DROPDOWN}>
                <span onClick={showDropDown}>. . .</span>
                {dropdown?
                <ul className="flex flex-col absolute">
                    <span onClick={showFieldsForChange} className="hover:text-yellow-600 cursor-pointer">edit</span>
                    <span className="hover:text-red-600 cursor-pointer" onClick={deleteTask}>delete</span>
                </ul>:null 
            }
            </div>
            
        </div>

        <p className={classesForTask.TASK_DESCRIPTION}>{task.description}</p>

        <div className="mt-auto flex gap-[10px]">
            <ul className="flex gap-[10px]">
                {task.tags ? task.tags.map(t => <li key={t.id} className="flex gap-2 items-center">
                    <div className="w-5 h-5 rounded-md" style={{background: t.color}}></div>
                    <span>{t.name}</span>
                </li>) : null}
            </ul>
            <p>{task.created_at}</p>
            <input onChange={chengeStatus} checked={task.status===1?true:false} className="ml-auto" type="checkbox" />
        </div>
    </li> 
    
    : 

    <li className={classesForTask.TASK_WRAPPER}>
        <div className={classesForTask.TASK_WRAPPER_TOP}>
            <input onChange={e => setTaskNameField(e.currentTarget.value)} className="border" value={taskNameField} type="text" />
        </div>    
            <input onChange={e => setTaskDescriptionField(e.currentTarget.value)} className="border" value={taskDescriptionField} type="text" />
            <ul className="flex gap-3">
                <li className="text-red-300">delete</li>
                {task.tags && task.tags.length > 0 ? task.tags.map(t => <TagsForDeleteComponent key={t.id} tag={t} 
                                                                                                           choiceTagForDelete={choiceTagForDelete} />) : 
                
                <li>no tags for delete!</li>}
            </ul>
            <ul className="flex gap-2">
                <li className="text-green-300">add</li>
                
                {tagsForFilter.filter(tag => !task.tags?.find(() => tag.id)).map(dt => <TagsForAddComponent key={dt.id} tag={dt}
                                                                            choiceTagForAdd={choiceTagForAdd}/>)}

                {/* {tagsForDelete?.map(dt => <TagsForAddComponent key={dt.id} tag={dt}
                                                                            choiceTagForAdd={choiceTagForAdd}/>)} */}
            </ul>
        <div className="flex gap-3 mt-auto">
            <button onClick={showFieldsForChange} className="border p-1  rounded-lg">Cancel</button>
            <button onClick={changeTask} className="border p-1 rounded-lg">Confrim</button>
        </div>
    </li>
}