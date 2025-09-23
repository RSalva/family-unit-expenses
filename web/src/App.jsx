import { Navigate, Route, Routes } from 'react-router';
import { LoginPage, UsersPage, ForbiddenPage, NotFoundPage, HomePage, RegisterPage, ProfilePage, UnitsPage, UnitCreationPage, UnitDetailPage, ExpenseCreationPage } from './pages';
import { Navbar } from './components/ui';
import { PrivateRoute } from './guards';
import { useAuth } from './contexts/auth';

function App() {
  const { user } = useAuth();
  return (
    <>
      <div>
        <Navbar />

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/users" element={<PrivateRoute><UsersPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/units" element={<PrivateRoute><UnitsPage /></PrivateRoute>} />
          <Route path="/units/:id" element={<PrivateRoute><UnitDetailPage /></PrivateRoute>} />
          <Route path="/units/create" element={<PrivateRoute><UnitCreationPage /></PrivateRoute>} />

          <Route path="/forbidden" element={<ForbiddenPage />} />
          <Route path="/not-found" element={<NotFoundPage />} />

          <Route path="/" element={user ? <Navigate replace to="/units" /> : <HomePage />} />

          <Route path="/expenses/create" element={<PrivateRoute><ExpenseCreationPage /></PrivateRoute>} />

          <Route path="*" element={<Navigate replace to="/not-found" />} />
        </Routes>
      </div>
    </>
  )
}

export default App;