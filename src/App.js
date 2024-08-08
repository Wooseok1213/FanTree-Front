import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import GroupPage from './components/GroupPage';
import FeedPopup from './components/FeedPopup';
import LoginPage from './components/LoginPage';
import SignupForm from './components/SignupForm';
import EntertainmentCreatePage from './components/EntertainmentCreatePage';
import ArtistGroupCreatePage from './components/ArtistGroupCreatePage';
import CreateArtistFeedPage from './components/CreateArtistFeedPage';
import EnterSignup from './components/EnterSignup';
import ArtistSignup from './components/ArtistSignup';
import AdminSignup from './components/AdminSignup';
import { AuthProvider } from './context/AuthContext';

const App = () => {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/group/:groupName" element={<GroupPage />} />
                <Route path="/group/:groupName/feed/:feedId" element={<FeedPopup />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/enterSignup" element={<EnterSignup />} />
                <Route path="/artistSignup" element={<ArtistSignup />} />
                <Route path="/adminSignup" element={<AdminSignup />} />
                <Route path="/create-enter" element={<EntertainmentCreatePage />} />
                <Route path="/create-artist-group" element={<ArtistGroupCreatePage />} />
                <Route path="/artistgroup/:groupName/feed" element={<CreateArtistFeedPage />} />
            </Routes>
        </AuthProvider>
    );
};

export default App;