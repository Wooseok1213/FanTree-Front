import React, { useEffect, useState } from 'react'; // Import React hooks
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import ArtistGroupService from '../service/ArtistGroupService'; // Import the service
import Header from '../components/Header'; // Import Header component
import Footer from '../components/Footer'; // Import Footer component
import { useAuthDispatch } from '../context/AuthContext'; // Import useAuthDispatch from your context
import './MainPage.css'; // Import CSS

const MainPage = () => {

    const dispatch = useAuthDispatch();
    const [artistGroups, setArtistGroups] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [artistProfiles, setArtistProfiles] = useState([]);

    useEffect(() => {
        // 로컬 스토리지에서 새로 고침 여부 확인
        const hasRefreshed = localStorage.getItem('hasRefreshed');

        if (!hasRefreshed) {
            // 새로 고침하지 않은 경우, 새로 고침 수행
            window.location.reload();

            // 로컬 스토리지에 새로 고침 상태 저장
            localStorage.setItem('hasRefreshed', 'true');
        }

        // 컴포넌트가 언마운트될 때 로컬 스토리지 초기화 (원하는 경우)
        return () => {
            localStorage.removeItem('hasRefreshed');
        };
    }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            dispatch({ type: 'LOGIN', payload: user });
        }
    }, [dispatch]);

    useEffect(() => {
        const fetchArtistGroups = async () => {
            try {
                const data = await ArtistGroupService.getArtistGroups();
                setArtistGroups(data || []); // Ensure data is an array
            } catch (error) {
                console.error('Error fetching artist groups:', error);
            }
        };

        const fetchAllArtistGroups = async () => {
            try {
                const data = await ArtistGroupService.getAllArtistGroups();
                setArtistProfiles(data || []); // Ensure data is an array
            } catch (error) {
                console.error('Error fetching all artist groups:', error);
            }
        };

        fetchArtistGroups();
        fetchAllArtistGroups();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                (prevIndex + 2) % artistGroups.length
            );
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [artistGroups]);

    const getTopGroup = () => {
        return artistGroups[0];
    };

    const getCurrentGroups = () => {
        const start = currentIndex + 1; // 2위부터 시작
        return artistGroups.slice(start, start + 2);
    };

    const handlePrevClick = () => {
        setCurrentIndex((prevIndex) =>
            (prevIndex - 2 + artistGroups.length) % (artistGroups.length - 1)
        );
    };

    const handleNextClick = () => {
        setCurrentIndex((prevIndex) =>
            (prevIndex + 2) % (artistGroups.length - 1)
        );
    };

    return (
        <div className="main-page">
            <header className="header">
                <Header />
            </header>
            <div className="main-content">
                <div className="top-group-section">
                    <div className="top-group">
                        {getTopGroup() && (
                            <Link
                                to={`/group/${getTopGroup().groupName}`}
                                key={getTopGroup().id}
                                className="top-group-item"
                            >
                                <img src={getTopGroup().artistGroupProfileImageUrl} alt={getTopGroup().groupName}
                                     className="top-group-image"/>
                                <div className="top-group-info">
                                    <span className="top-ranking-number">01</span>
                                    <h3 className="top-group-name">{getTopGroup().groupName}</h3>
                                    <span className="top-subscribe-count">구독자 수: {getTopGroup().subscribeCount}</span>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
                <div className="ranking-section">
                    <button className="nav-button prev-button" onClick={handlePrevClick}>&lt;</button>
                    <div className="ranking-grid">
                        {getCurrentGroups().map((group, index) => (
                            <Link
                                to={`/group/${group.groupName}`}
                                key={group.id}
                                className="ranking-item"
                            >
                                <img src={group.artistGroupProfileImageUrl} alt={group.groupName}
                                     className="artist-image"/>
                                <div className="ranking-info">
                                    <span className="ranking-number">
                                        {String(Math.floor(currentIndex / 2) * 2 + index + 2).padStart(2, '0')}
                                    </span>
                                    <h3 className="group-name">{group.groupName}</h3>
                                    <span className="subscribe-count">구독자 수 : {group.subscribeCount}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <button className="nav-button next-button" onClick={handleNextClick}>&gt;</button>
                </div>
                <div className="profile-section">
                    <h2>아티스트 프로필</h2>
                    <ul className="profile-list">
                        {artistProfiles.length > 0 ? (
                            artistProfiles.map((artist) => (
                                <Link
                                    to={`/group/${artist.groupName}?enter=${artist.enterName}`}
                                    key={artist.id}
                                    className="profile-item"
                                >
                                    <img src={artist.artistGroupProfileImageUrl} alt={artist.artistName}
                                         className="artist-profile-image"/>
                                    <span className="profile-group-name">{artist.groupName}</span>
                                </Link>
                            ))
                        ) : (
                            <li>아티스트 프로필이 없습니다.</li>
                        )}
                    </ul>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default MainPage;