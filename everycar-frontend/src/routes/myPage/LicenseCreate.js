import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LicenseCreate = () => {
    const [licenseNum, setLicenseNum] = useState('');
    const [licenseDate, setLicenseDate] = useState('');
    const [licenseEndDate, setLicenseEndDate] = useState('');
    const [licensePhoto, setLicensePhoto] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setLicensePhoto(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('licenseNum', licenseNum);
        formData.append('licenseDate', licenseDate);
        formData.append('licenseEndDate', licenseEndDate);
        formData.append('licensePhoto', licensePhoto);

        try {
            const response = await fetch('http://localhost:8080/api/license/register', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                navigate('/myPage/info'); // 등록 후 마이페이지로 이동
            } else {
                alert('등록 실패: ' + data.message);
            }
        } catch (error) {
            console.error('면허 등록 오류:', error);
            alert('면허 등록 중 오류가 발생했습니다.');
        }
    };

    return (
        <div>
            <h1>🚗 면허 정보 등록</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>면허 번호:</label>
                    <input type="text" value={licenseNum} onChange={(e) => setLicenseNum(e.target.value)} required />
                </div>
                <div>
                    <label>발급일:</label>
                    <input type="date" value={licenseDate} onChange={(e) => setLicenseDate(e.target.value)} required />
                </div>
                <div>
                    <label>만료일:</label>
                    <input type="date" value={licenseEndDate} onChange={(e) => setLicenseEndDate(e.target.value)} required />
                </div>
                <div>
                    <label>면허증 사진:</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} required />
                </div>
                <button type="submit">등록하기</button>
            </form>
        </div>
    );
};

export default LicenseCreate;
