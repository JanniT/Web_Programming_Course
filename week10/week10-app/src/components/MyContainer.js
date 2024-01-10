import { useState } from "react"
import MyList from "./MyList"

function MyContainer () {

  const [items, setItems] = useState([
    { id: "1", text: "This is an item" },
    { id: "2", text: "Also this" },
  ])

  // state for the text area text
  const [itemText, setItemText] = useState("")

  const addNewItem = () => {
    // First checking that the text area has text
    if (itemText.trim() !== "") {

      //using the setItems to update the state depending on the previous state
      setItems((prevItems) => [
        ...prevItems,
        { id: String(prevItems.length + 1),
          text: itemText,
        },
      ])

      //clearing the text area
      setItemText("")
    }
  }

  return (
    <div>
      <MyList
        header="Really epic list component"
        items={items}
      />

      <textarea 
        value={itemText}
        onChange={(e) => setItemText(e.target.value)}
      />

      <button onClick={addNewItem}>Add Item</button>
    </div>
  )
}

export default MyContainer