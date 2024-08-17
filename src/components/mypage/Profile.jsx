import React, {useEffect, useState} from "react";
import {Image} from 'react-bootstrap';
import axios from 'axios';
// import './MyPage.css';
import apiClient from "../../service/apiClient";
import './Profile.css';


const Profile = () => {
    const accessToken = localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져오기
    const [userImage, setUserImage] = useState("holder.js/100x100"); // 기본 이미지 설정
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [editing, setEditing] = useState(false); // 닉네임, 이메일, 비밀번호 수정 상태

    const [originalNickname, setOriginalNickname] = useState("");
    const [originalEmail, setOriginalEmail] = useState("");
    const [originalUserImage, setOriginalUserImage] = useState("holder.js/100x100");

    // 정보 불러오기
    useEffect(() => {
        apiClient.get('/users', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${accessToken}`
            }
        })
            .then(response => {
                setNickname(response.data.nickname);
                setEmail(response.data.email);
                setUserImage(response.data.profileImageUrl || "holder.js/100x100");

                setOriginalNickname(response.data.nickname);
                setOriginalEmail(response.data.email);
                setOriginalUserImage(response.data.profileImageUrl || "holder.js/100x100");
            })
            .catch(error => console.error('Error fetching user data:', error));
    }, [accessToken]);

    // 프로필 이미지 변경 처리
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserImage(reader.result);
            };
            reader.readAsDataURL(file);
            saveProfileImage(file); // 파일을 서버에 저장
        }
    };

    // 프로필 이미지 저장
    const saveProfileImage = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await apiClient.put('/users/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `${accessToken}`
                }
            });
            console.log('Profile image updated successfully:', response.data);
        } catch (error) {
            console.error('Error updating profile image:', error);
        }
    };

    // 폼 제출 처리
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 현재 비밀번호가 없으면 저장하지 않도록 처리
        if (password === "") {
            alert("현재 비밀번호를 입력해야 합니다.");
            return;
        }

        const formData = new FormData();
        formData.append('nickname', nickname || nickname);
        formData.append('email', email || email);
        formData.append('password', password);
        formData.append('newPassword', newPassword || newPassword);

        const fileInput = document.getElementById('image-upload');
        const file = fileInput.files[0]; // 선택된 파일 가져오기
        if (file) {
            formData.append('file', file); // 파일 추가
        }

        try {
            const response = await apiClient.put('/users', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `${accessToken}`
                }
            });
            console.log('Profile updated successfully:', response.data);
            setEditing(false);

            // 업데이트된 값들을 original 값으로 설정
            setOriginalNickname(nickname);
            setOriginalEmail(email);
            setOriginalUserImage(userImage);

        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleSettingsClick = () => {
        if (editing) {
            const formHasChanges =
                nickname !== originalNickname ||
                email !== originalEmail ||
                password !== "" ||
                newPassword !== "" ||
                userImage !== originalUserImage;

            if (formHasChanges) {
                const confirmSave = window.confirm("저장하시겠습니까?");
                if (confirmSave) {
                    // 폼 제출 요청
                    document.getElementById('mypage-profile-form').requestSubmit();
                } else {
                    setEditing(false); // 편집 모드 종료
                    // 변경사항 취소하고 원래 값으로 되돌리기
                    setNickname(originalNickname);
                    setEmail(originalEmail);
                    setUserImage(originalUserImage);
                    setPassword(""); // 비밀번호 필드 초기화
                    setNewPassword(""); // 새 비밀번호 필드 초기화
                }
            } else {
                setEditing(false); // 변경사항이 없으면 그냥 편집 모드 종료
                setPassword(""); // 비밀번호 필드 초기화
                setNewPassword(""); // 새 비밀번호 필드 초기화
            }
        } else {
            // 편집 모드로 전환
            setEditing(true);
        }
    };

    return (
        <div className="status-message"
             style={{
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'space-between',
                 minHeight: '100px', // 컨테이너의 최소 높이
                 height: '230px', // 컨테이너의 고정 높이
                 overflow: 'hidden',
             }}>

            {/* 왼쪽: 프로필 이미지 */}
            <div style={{display: 'flex', alignItems: 'center'}}>
                <label htmlFor="image-upload" className="image-upload">
                    <Image src={userImage} roundedCircle className="user-image"/>
                </label>
                <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{display: 'none'}}
                />
            </div>

            {/* 가운데: 상태 메시지, 닉네임, 이메일 */}
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                {editing ? (
                    <form id="mypage-profile-form"
                          onSubmit={handleSubmit}> {/* 폼 태그 추가 및 onSubmit 이벤트에 handleSubmit 연결 */}
                        <label htmlFor="nickname-input" className="simple-profile-label">
                            nickname:
                            <input
                                id="nickname-input"
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="닉네임을 입력하세요"
                                className="simple-profile-input-field"
                            />
                        </label>
                        <label htmlFor="nickname-input" className="simple-profile-label">
                            email:
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="simple-profile-input-field"
                            />
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="simple-profile-input-field-password"
                            placeholder="비밀번호를 입력하세요"
                        />
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="simple-profile-input-field-password"
                            placeholder="새 비밀번호를 입력하세요"
                        />
                        <button type="submit" style={{display: 'none'}}>Save</button>
                        {/* 숨겨진 제출 버튼 */}
                    </form>
                ) : (
                    <>
                        <span style={{marginTop: '10px'}}>{nickname}</span>
                        <span style={{marginTop: '5px', color: 'gray'}}>{email}</span>
                    </>
                )}
            </div>

            {/* 오른쪽: "프로필 편집" 버튼 */}
            <div style={{alignSelf: 'flex-start'}}>
                <button onClick={handleSettingsClick}
                        className="simple-profile-custom-button"
                        >
                    프로필 편집
                </button>
            </div>
        </div>
    );
};

export default Profile;
