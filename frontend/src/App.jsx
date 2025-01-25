import react from "react"
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import NotFound from "./pages/NotFound"
import Home from "./pages/Home"
import ProtectedRoute from "./components/ProtectedRoute"
import Main from "./pages/Main"

function Logout() {
  localStorage.clear()
  return <Navigate to = "/home"/> 
}

function RegisterAndLogout() {
  localStorage.clear()
  return<Register /> 
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path ="/"
          element ={
            <ProtectedRoute>
              <Main/>
            </ProtectedRoute>
          }
        />
        <Route path = "/home" element = {<Home/>}/>
        <Route path ="/login" element ={<Login/>} />
        <Route path ="/logout" element = {<Logout/>}/>
        <Route path ="/register" element ={<RegisterAndLogout/>} />
        <Route path ="*" element = {<NotFound />}/>
      </Routes>
    </BrowserRouter>
  )
}


export default App
