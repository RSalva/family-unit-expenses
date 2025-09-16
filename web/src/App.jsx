import { Navigate, Route, Routes } from 'react-router';
import { LoginPage, UsersPage, ForbiddenPage, NotFoundPage, HomePage, RegisterPage } from './pages';
import { Navbar } from './components/ui';
import { PrivateRoute } from './guards';

function App() {
  return (
    <>
      <div>
        <Navbar />

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/users" element={<PrivateRoute><UsersPage /></PrivateRoute>} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/forbidden" element={<ForbiddenPage />} />
          <Route path="/not-found" element={<NotFoundPage />} />

          <Route path="/" element={<HomePage />} />

          <Route path="*" element={<Navigate replace to="/not-found" />} />
        </Routes>
      </div>
    </>
  )
}

export default App;