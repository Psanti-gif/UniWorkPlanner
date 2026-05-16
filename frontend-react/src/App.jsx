import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ToastContainer } from './components/Toast'
import { DashboardPage }  from './pages/DashboardPage'
import { TaskListPage }   from './pages/tasks/TaskListPage'
import { TaskFormPage }   from './pages/tasks/TaskFormPage'
import { TaskDetailPage } from './pages/tasks/TaskDetailPage'
import { KanbanPage }     from './pages/tasks/KanbanPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"      element={<DashboardPage />} />
          <Route path="/tasks"          element={<TaskListPage />} />
          <Route path="/tasks/new"      element={<TaskFormPage />} />
          <Route path="/tasks/kanban"   element={<KanbanPage />} />
          <Route path="/tasks/:id"      element={<TaskDetailPage />} />
          <Route path="/tasks/:id/edit" element={<TaskFormPage />} />
          <Route path="*"               element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}
