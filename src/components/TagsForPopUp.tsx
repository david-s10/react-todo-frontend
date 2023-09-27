import React, { useState } from "react"
import { tagInterface } from "../slices/todoSlice"

interface TagProps {
    
    tag: tagInterface
    choiceTagForTodo: Function
}

export const TagsForPopUp: React.FC<TagProps> = ({ tag, choiceTagForTodo }) => {
    const [choiseTagStatus, setChoiseTagStatus] = useState<boolean>(false)

    const choiceTag = () => {
        choiceTagForTodo(tag.id)
        setChoiseTagStatus(!choiseTagStatus)
    }

    return <li onClick={choiceTag} className={choiseTagStatus?"text-orange-400 text-xl cursor-pointer select-none":'text-xl cursor-pointer select-none'}>{tag.name}</li>
}