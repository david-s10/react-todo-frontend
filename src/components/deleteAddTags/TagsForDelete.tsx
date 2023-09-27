import { useState } from "react"
import { tagInterface } from "../../slices/todoSlice"

interface tagsForDeleteProps {
    tag: tagInterface
    choiceTagForDelete: ((id: number) => void)
}


export const TagsForDeleteComponent: React.FC<tagsForDeleteProps> = (props) => {
    const [colorForDeleteTag, setColorForDeleteTag] = useState(false)



    const choice = () => {
        props.choiceTagForDelete(props.tag.id)
        setColorForDeleteTag(!colorForDeleteTag)
    }
    
    const classForDeleteTag = `select-none ${colorForDeleteTag?'text-orange-400':null}`

    return (
        <li onClick={choice} className={classForDeleteTag}>{props.tag.name}</li>
    )
}