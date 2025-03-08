import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../css/routes/myPage/info/LicenseCreate.module.scss";
import useLicense from "../../../components/hooks/useLicense";

const LicenseCreate = () => {
    const navigate = useNavigate();
    const { registerLicense, message } = useLicense();

    const [licenseNum, setLicenseNum] = useState("");
    const [licenseDate, setLicenseDate] = useState("");
    const [licenseEndDate, setLicenseEndDate] = useState("");
    const [licensePhoto, setLicensePhoto] = useState(null);

    // 파일 선택 핸들러
    const handleFileChange = (e) => {
        setLicensePhoto(e.target.files[0]);
    };

    // 면허 정보 등록
    const handleSubmit = async (e) => {
        e.preventDefault();
        await registerLicense({ licenseNum, licenseDate, licenseEndDate, licensePhoto });
        navigate("/myPage/info"); // 등록 성공 후 마이페이지로 이동
    };

    return (
        <div className={styles.licenseCreate}>
            <h1>🚗 면허 정보 등록</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <table>
                    <tbody>
                        <tr>
                            <th>면허 번호</th>
                            <td>
                                <input
                                    type="text"
                                    value={licenseNum}
                                    onChange={(e) => setLicenseNum(e.target.value)}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>발급일</th>
                            <td>
                                <input
                                    type="date"
                                    value={licenseDate}
                                    onChange={(e) => setLicenseDate(e.target.value)}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>만료일</th>
                            <td>
                                <input
                                    type="date"
                                    value={licenseEndDate}
                                    onChange={(e) => setLicenseEndDate(e.target.value)}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>면허증 사진</th>
                            <td>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    required
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* 오류 메시지 표시 */}
                {message && <p style={{ color: "red" }}>{message}</p>}

                <button type="submit" className={styles.submitButton}>등록하기</button>
            </form>
        </div>
    );
};

export default LicenseCreate;
