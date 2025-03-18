import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLicenseInfo } from "../../redux/userSlice";
import ApiClient from "../common/ApiClient";  // ApiClient 임포트

const useLicense = () => {
    const dispatch = useDispatch();
    
    const licenseInfo = useSelector((state) => state.user.licenseInfo);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLicenseInfo = async () => {
            try {
                // ApiClient를 사용하여 면허 정보를 가져옴
                const data = await ApiClient('http://localhost:8080/api/license/myLicense', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                dispatch(setLicenseInfo({
                    licenseNum: data.licenseNum || '',
                    licenseDate: data.licenseDate || '',
                    licenseEndDate: data.licenseEndDate || '',
                    licensePhoto: data.licensePhoto || null,
                }));
            } catch (error) {
                console.error('면허 정보 불러오기 오류:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLicenseInfo();
    }, [dispatch]);

    return { loading, licenseInfo };
};

export default useLicense;
