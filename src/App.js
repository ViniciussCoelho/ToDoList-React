import './App.css';

import { useState, useEffect } from 'react';
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from 'react-icons/bs';

const API = "http://localhost:5000";

function App() {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const res = await fetch(`${API}/todos`).then(res => res.json()).then(data => data).catch(err => console.log(err));
      setTodos(res);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const todo = {
      id: Math.random(),
      title,
      time,
      done: false
    };

    await fetch(`${API}/todos`, {
      method: 'POST',
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json"
      }
    })

    setTodos(prevTodos => [...prevTodos, todo]);
    setTitle('');
    setTime('');
    console.log("Form submitted");
  }

  const handleDelete = async (id) => {
    await fetch(`${API}/todos/${id}`, {
      method: 'DELETE'
    })

    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }

  const handleDone = async (todo) => {
    todo.done = !todo.done;

    await fetch(`${API}/todos/${todo.id}`, {
      method: 'PUT',
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json"
      }
    })

    setTodos(prevTodos => prevTodos.map(t => t.id === todo.id ? todo : t));
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="App">
      <div className="todo-header">
        <h1>React Todo</h1>
      </div>
      <div className="form-todo">
        <h2>Insert a new task:</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="title">Add a new task!</label>
            <input type="text" name="title" placeholder="Task Title" onChange={(e) => setTitle(e.target.value)} value={title || ""} required />
          </div>
          <div className="form-control">
            <label htmlFor="time">Time</label>
            <input type="text" name="time" placeholder="Task time" onChange={(e) => setTime(e.target.value)} value={time || ""} required />
          </div>
          <input type="submit" value="submit" />
        </form>
      </div>
      <div className="list-todo">
        <h2>List</h2>
        {todos.length === 0 && <p>No todos yet!</p>}
        {todos.map(todo => (
          <div key={todo.id} className="todo">
            <h3 class={todo.done ? "todo-done" : ""}>{todo.title}</h3>
            <p>Time: {todo.time}</p>
            <div className="actions">
              <span onClick={() => handleDone(todo)}>
              {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
            </span>
            <BsTrash onClick={() => handleDelete(todo.id)} />
          </div>
          </div>
        ))}
    </div>
    </div >
  );
}

export default App;
