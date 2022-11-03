import { useEffect, useState } from 'react'
import PocketBase from 'pocketbase';

const url = "http://localhost:8090/api/collections/todo/records"
const client = new PocketBase('http://localhost:8090');

const FormAddTodo = () => {
  const [text, setText] = useState("")
  const onSubmit = () => {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ todo: text })
    })
      .then(rs => rs.json())
      .then(data => {
        alert(`add id=${data.id} todo=${data.todo} completed!`)
        setText("")
      })
  }

  return (
    <div>
      <input value={text} onChange={({ target }) => setText(target.value)} />
      <button onClick={onSubmit}>ADD</button>
    </div>
  )
}
const ListTodo = () => {
  const [list, setList] = useState([])

  const reloadData = async () => {
    // fetch(url)
    //   .then(rs => rs.json())
    //   .then(data => setList(data.items))

    const list = await client.records.getFullList('todo', 200)
    setList(list)
  }

  useEffect(() => {
    reloadData()

    client.realtime.subscribe('todo', function (e) {
      // setList((p) => [...p, e.record]);
      reloadData()
    });

    return (() => client.realtime.unsubscribe('todo'))
  }, [])

  return (
    <div>
      <h1>Demo PocketBase Client - Realtime Database</h1>
      <h2>List TODO</h2>
      {list.map(i => <li key={i.id}>{i.todo}</li>)}
    </div>
  )
}

const App = () => {

  return (
    <div className="App">
      <FormAddTodo />
      <div>
        <ListTodo />
      </div>
    </div>
  )
}

export default App
