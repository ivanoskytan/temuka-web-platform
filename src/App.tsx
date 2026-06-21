import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Universities from './pages/Universities';
import CommunityPage from './pages/CommunityDetail';
import UniversityDetail from './pages/UniversityDetail';
import Submit from './pages/Submit';
import Post from './pages/Post';
import Communities from './pages/Communities';
import RouteWrapper from './components/RouteWrapper';
import CommunitySubmit from './pages/CommunitySubmit';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <RouteWrapper type="public">
              <Login />
            </RouteWrapper>
          }
        />
        <Route
          path="/register"
          element={
            <RouteWrapper type="public">
              <Register />
            </RouteWrapper>
          }
        />

        <Route
          path="/"
          element={
            <RouteWrapper type="public">
              <Home />
            </RouteWrapper>
          }
        />
        <Route
          path="/submit"
          element={
            <RouteWrapper type="public">
              <Submit />
            </RouteWrapper>
          }
        />
        <Route
          path="/community/:slug/submit"
          element={
            <RouteWrapper type="public">
              <CommunitySubmit />
            </RouteWrapper>
          }
        />
        <Route
          path="/post/:id"
          element={
            <RouteWrapper type="public">
              <Post />
            </RouteWrapper>
          }
        />
        <Route
          path="/universities"
          element={
            <RouteWrapper type="public">
              <Universities />
            </RouteWrapper>
          }
        />
        <Route
          path="/university/:slug"
          element={
            <RouteWrapper type="public">
              <UniversityDetail />
            </RouteWrapper>
          }
        />
        <Route
          path="/communities"
          element={
            <RouteWrapper type="public">
              <Communities />
            </RouteWrapper>
          }
        />
        <Route
          path="/community/:slug"
          element={
            <RouteWrapper type="public">
              <CommunityPage />
            </RouteWrapper>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <RouteWrapper type="public">
              <Profile />
            </RouteWrapper>
          }
        />
        <Route
          path="/settings"
          element={
            <RouteWrapper type="public">
              <Settings />
            </RouteWrapper>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
