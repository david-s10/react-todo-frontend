import { useState } from "react"
import { Sidebar} from "../../components/SideBar"
import { TodoList } from "../../components/TodoList"
import { useAppSelector } from "../../store/hooks"
import { useNavigate } from "react-router-dom"

export type TodoStatusType = '' | 0 | 1
export type currentFilterType = 'Today' | "All" | "Important"
export type renderType = undefined | 0 | 1

export const TodoPage = () => {
    const navigate = useNavigate()
    const [tagForFilter, setTagForFilter] = useState<string>('')
    const [dateForFilter, setDateForFilter] = useState<string>('')
    const [importantForFilter, setImportantForFilter] = useState<1 | ''>('')
    const [tasksCheck, setTasksCheck] = useState<TodoStatusType>('')
    const [currentFilterForView, setCurrentFilterForView] = useState<currentFilterType>('All')
    const user = useAppSelector(state => state.user.authUser)
    const [render, setRender] = useState<renderType>()

    const choiseFilterForView = (value: currentFilterType) => {
        setCurrentFilterForView(value)
    }

    const filterByTag = (tag: string) => {
        setTagForFilter(tag)
    }

    const filterByImportant = (important: 1 | '' ) => {
        setImportantForFilter(important)
    }

    const filterByDate = (date: string) => {
        setDateForFilter(date)
    }
    const filterByStatus = (status: TodoStatusType) => {
        setTasksCheck(status)
    }

    const renderTrigger = () => {
        render?setRender(0):setRender(1)
    }

    if(!user){
        navigate('/login',{replace : true})
    }
    
    return (
        user?<>
        <Sidebar filterByTag={filterByTag}
                 filterByDate={filterByDate}
                 filterByStatus={filterByStatus}
                 choiseFilterForView={choiseFilterForView}
                 filterByImportant={filterByImportant}
                 currentFilterForView={currentFilterForView}
                 renderTrigger={renderTrigger}/>
        <TodoList tagForFilter={tagForFilter} 
                  dateForFilter={dateForFilter}
                  importantForFilter={importantForFilter}
                  filterByStatus={filterByStatus}
                  currentFilterForView={currentFilterForView}
                  tasksCheck={tasksCheck}

                  renderTrigger={renderTrigger}
                  render={render}/>
    </>:null
        
    )
}