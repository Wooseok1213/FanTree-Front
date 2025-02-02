import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './MyPage.css';
import Profile from './Profile';
import Buttons from './Buttons';
import Header from "../Header";

const MyPage = () => {

    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false); // 사용자 인증 상태

    useEffect(() => {
        // localStorage에서 accessToken을 가져옵니다.
        const accessToken = localStorage.getItem('accessToken');

        // accessToken이 존재하면 인증된 것으로 간주합니다.
        if (accessToken) {
            setIsAuthenticated(true);
        } else {
            navigate('/login'); // accessToken이 없으면 로그인 페이지로 리다이렉트합니다.
        }
    }, [navigate]);

    if (!isAuthenticated) {
        return null; // 인증되지 않았을 경우, 리다이렉트 전 빈 페이지를 반환합니다.
    }


    return (
        <div className="fan-tree-house_container">
            <header className="mypage-header">
                <Header/>
                <div style={{display: 'flex', alignItems: 'center', flex: '2', marginLeft: '300px'}}>
                </div>
            </header>

            {/* 개인 간략 프로필 */}
            <Profile />
            <Buttons/>
        </div>
    );
};

export default MyPage;
