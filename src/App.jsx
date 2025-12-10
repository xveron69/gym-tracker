import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

import { Dashboard } from './pages/Dashboard';
import { CreatePlan } from './pages/CreatePlan';

import { WorkoutSelection } from './pages/WorkoutSelection';
import { ActiveSession } from './pages/ActiveSession';
import { History } from './pages/History';
import { CalendarPage } from './pages/CalendarPage';
import { ReportsPage } from './pages/ReportsPage';
import { MyPlans } from './pages/MyPlans';
import { EditPlan } from './pages/EditPlan.jsx';
import ExerciseLibrary from './pages/ExerciseLibrary';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-primary">Ładowanie...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="plans" element={<MyPlans />} />
            <Route path="plans/new" element={<CreatePlan />} />
            <Route path="plans/edit/:planId" element={<EditPlan />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="workout" element={<WorkoutSelection />} />
            <Route path="workout/active" element={<ActiveSession />} />
            <Route path="history" element={<History />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="library" element={<ExerciseLibrary />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
