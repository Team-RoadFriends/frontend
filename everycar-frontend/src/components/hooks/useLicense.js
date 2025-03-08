import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLicenseInfo } from "../../redux/userSlice";

const useLicense = () => {
    const dispatch = useDispatch();
    const { licenseInfo } = useSelector(state => state.user);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    // 면허 정보 가져오기 (`GET /api/license/myLicense`)
    const fetchLicenseInfo = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/license/myLicense", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("면허 정보 없음");
            }

            const data = await response.json();
            dispatch(setLicenseInfo(data)); // Redux에 저장
        } catch (error) {
            console.error("면허 정보 불러오기 오류:", error);
        } finally {
            setLoading(false);
        }
    };

    // 면허 정보 등록 (`POST /api/license/register`)
    const registerLicense = async ({ licenseNum, licenseDate, licenseEndDate, licensePhoto }) => {
        const token = localStorage.getItem("token");

        if (!licenseNum || !licenseDate || !licenseEndDate || !licensePhoto) {
            setMessage("모든 정보를 입력해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append("licenseNum", licenseNum);
        formData.append("licenseDate", licenseDate);
        formData.append("licenseEndDate", licenseEndDate);
        formData.append("licensePhoto", licensePhoto);

        try {
            const response = await fetch("http://localhost:8080/api/license/register", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                dispatch(setLicenseInfo({
                    licenseNum,
                    licenseDate,
                    licenseEndDate,
                    licensePhoto: URL.createObjectURL(licensePhoto) // 이미지 미리보기용
                }));
                setMessage("면허 정보가 등록되었습니다.");
            } else {
                setMessage(data.message || "면허 등록 실패");
            }
        } catch (error) {
            console.error("면허 등록 오류:", error);
            setMessage("서버 오류 발생");
        }
    };

    useEffect(() => {
        fetchLicenseInfo();
    }, [dispatch]);

    return { loading, licenseInfo, registerLicense, message };
};

export default useLicense;
