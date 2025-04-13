
import { useState } from 'react'
import './App.css'

import PersonTable from './components/personTable'
import ConnectionTable from './components/connectionTable'

function App() {
  const [tableView, setTableView] = useState('connection')

  return (
    <div>
      { tableView === 'person' && <PersonTable/> }
      { tableView === 'connection' && <ConnectionTable/> }
      <button disabled={ tableView === 'person' } onClick={ () => setTableView('person') }>Person Table</button>
      <button disabled={ tableView === 'connection' } onClick={ () => setTableView('connection') }>Connection Table</button>
    </div>
  )
}

export default App
