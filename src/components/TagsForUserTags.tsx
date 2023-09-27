import { deleteUserTag, tagInterface } from "../slices/todoSlice"
import { useAppDispatch } from "../store/hooks"


interface userTagInterface {
    tag: tagInterface
    filterByTag: ((tag: string)=> void)
    renderTrigger: (() => void)
}

export const TagsForUserTags: React.FC<userTagInterface> = ({tag, filterByTag, renderTrigger}) => {
    const dispatch = useAppDispatch()

    const deleteTag = () => {
        dispatch(deleteUserTag(tag.id))
        renderTrigger()
        
    }

    const choiceTag = () => {
        filterByTag(tag.name)
    }

    return (
        <li className="flex gap-x-2">
            <div className="w-5 h-5 rounded-md" style={{background: tag.color}}></div>
            <span className="cursor-pointer" onClick={choiceTag}>{tag.name}</span>
            <span className="ml-auto hover:text-red-600 cursor-pointer" onClick={deleteTag}>delete</span>
        </li>
    )
}