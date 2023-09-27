import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AuthPage } from "./pages/auth/AuthPage";
import { TodoPage } from "./pages/todolist/TodoPage";
import { SingleTodoPage } from "./pages/todolist/SingleTodo";



export default function App() {


  return(
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/mytodo" element={<TodoPage/>}/>
          <Route path="/mytodo/:id" element={<SingleTodoPage />}/>
        </Route>
          <Route path="/registration" element={<AuthPage/>}/>
          <Route path="/login" element={<AuthPage/>}/>
      </Routes>
    </>
  )
}