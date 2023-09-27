import { useState } from "react"
import { tagInterface } from "../../slices/todoSlice"

interface tagsForAddProps {
    tag: tagInterface
    choiceTagForAdd: ((id: number) => void)
}


export const TagsForAddComponent: React.FC<tagsForAddProps> = (props) => {
    const [colorForAddTag, setColorForAddTag] = useState(false)



    const choice = () => {
        props.choiceTagForAdd(props.tag.id)
        setColorForAddTag(!colorForAddTag)
    }
    
    const classForAddTag = `select-none ${colorForAddTag?'text-green-400':null}`

    return (
        <li onClick={choice} className={classForAddTag}>{props.tag.name}</li>
    )
}