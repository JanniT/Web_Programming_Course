import React, {useState, useEffect} from 'react'

function About() {
  const url = 'https://jsonplaceholder.typicode.com/posts'

  // setting the state to store the data that is gotten from the Api
  let [userData, setUserData] = useState([])

  useEffect(() => {
    let mounted = true
    // fetching the data from the api
    const fetchData = async () => {
      try {
        const response = await fetch(url)
        const data = await response.json()
        setUserData(data)
      } catch (error) {
        console.error("Error fetching data: ", error)
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      <h1>About</h1>
      <ul>
        {userData.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default About;
