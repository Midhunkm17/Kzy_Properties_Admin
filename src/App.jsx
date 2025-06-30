
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Layout/Layout'
import ManageProperties from './pages/ManageProperties'
import AddProperty from './pages/AddProperty'
import DashboardHome from './pages/DashboardHome'

function App() {

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
        <Route path='/' element={<DashboardHome/>} />
          <Route path='/properties' element={<ManageProperties/>} />
          <Route path='/add-property' element={<AddProperty/>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
