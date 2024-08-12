import './App.css'
import InputForm from './components/InputForm'
import { useContext } from 'react';
import UserContext from './UserContext';

function App() {
  const { sentiment } = useContext(UserContext);
  return (
    <>
      <nav className="nav">
        <select name="dropdown" className="select">
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </nav>
      <div className="container">
        <h1>Hello, user</h1>
        <p>Just a quick check in</p>
        <InputForm />
        
        {sentiment && <p>Sentiment: {sentiment}</p>}
      </div>
    </>
  )
}

export default App
