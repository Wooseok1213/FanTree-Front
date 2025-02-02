import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEntertainment } from '../service/EntertainmentService';
import Header from '../components/Header';
import './EntertainmentCreatePage.css';

const CreateEntertainment = () => {
    const [enterName, setEnterName] = useState('');
    const [enterNumber, setEnterNumber] = useState('');
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = window.localStorage.getItem('accessToken');

        if (!token) {
            setMessage('권한이 없습니다. 로그인이 필요합니다.');
            return;
        }

        try {
            const enterData = {
                enterName,
                enterNumber: parseInt(enterNumber),
                file
            };

            const response = await createEntertainment(enterData, token);
            alert('엔터테인먼트 계정이 성공적으로 생성되었습니다.');
            setEnterName('');
            setEnterNumber('');
            setFile(null);
            navigate('/');
        } catch (error) {
            alert(error.response.data.message);
            setMessage('엔터테인먼트 계정 생성에 실패했습니다: ' + error.message);
        }
    };

    return (
        <>
            <Header />
            <div className="container">
                <h2>엔터테인먼트 계정 생성</h2>
                <form onSubmit={handleSubmit} className="form-container">
                    <div className="form-group">
                        <label htmlFor="enterName">소속사 이름:</label>
                        <input
                            type="text"
                            id="enterName"
                            value={enterName}
                            onChange={(e) => setEnterName(e.target.value)}
                            className="input-field"
                            required
                            maxLength="20"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="enterNumber">사업자 번호:</label>
                        <input
                            type="number"
                            id="enterNumber"
                            value={enterNumber}
                            onChange={(e) => setEnterNumber(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="file" className="image-upload-label">
                            {file ? (
                                <img src={URL.createObjectURL(file)} alt="Logo" className="preview-image" />
                            ) : (
                                <div className="image-placeholder">이미지를 클릭하여 추가하세요</div>
                            )}
                            <input
                                type="file"
                                id="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="file-input"
                                accept="image/*"
                                required
                            />
                        </label>
                    </div>
                    <button type="submit" className="submit-button">계정 생성</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </>
    );
};

export default CreateEntertainment;