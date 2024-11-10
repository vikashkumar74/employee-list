import React, { useState, useEffect, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./EditEmployee.css"
function EditEmployee() {
    const { id } = useParams();
    const [employee, setEmployee] = useState({});
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobileNo: '',
        gender: '',
        destination: '',
        course: [],
    });
    const [fileName, setFileName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/auth/employees/${id}`);
                const employeeData = response.data;
                setEmployee(employeeData);
                setFormData({
                    name: employeeData.name,
                    email: employeeData.email,
                    mobileNo: employeeData.mobileNo,
                    gender: employeeData.gender,
                    destination: employeeData.destination,
                    course: employeeData.course,
                });
                setFileName(employeeData.imgUpload);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching employee:", error);
                navigate('/employeeList');
            }
        };

        fetchEmployee();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCourseChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prevState) => {
            let updatedCourses = [...prevState.course];
            if (checked) {
                updatedCourses.push(value);
            } else {
                updatedCourses = updatedCourses.filter((course) => course !== value);
            }
            return {
                ...prevState,
                course: updatedCourses,
            };
        });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('mobileNo', formData.mobileNo);
        data.append('gender', formData.gender);
        data.append('destination', formData.destination);
        data.append('course', formData.course.join(','));
        if (file) {
            data.append('imgUpload', file);
        }

        try {
            await axios.put(`http://localhost:3001/auth/employees/${id}`, data, { withCredentials: true });
            navigate('/employeeList');
        } catch (error) {
            console.error("Error updating employee:", error);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <Fragment>
            <div className='header'>Employee Edit</div>
        <div className="edit-employee-form">
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Mobile No:</label>
                    <input
                        type="text"
                        name="mobileNo"
                        value={formData.mobileNo}
                        onChange={handleInputChange}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Gender:</label>
                    <div className="radio-group">
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="gender"
                                value="M"
                                checked={formData.gender === 'M'}
                                onChange={handleInputChange}
                                className="radio-input"
                            />
                            Male
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="gender"
                                value="F"
                                checked={formData.gender === 'F'}
                                onChange={handleInputChange}
                                className="radio-input"
                            />
                            Female
                        </label>
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">Destination:</label>
                    <select
                        name="destination"
                        value={formData.destination}
                        onChange={handleInputChange}
                        className="form-input"
                    >
                        <option value="HR">HR</option>
                        <option value="Manager">Manager</option>
                        <option value="Sales">Sales</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Course:</label>
                    <div className="checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                value="MCA"
                                checked={formData.course.includes('MCA')}
                                onChange={handleCourseChange}
                                className="checkbox-input"
                            />
                            MCA
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                value="BCA"
                                checked={formData.course.includes('BCA')}
                                onChange={handleCourseChange}
                                className="checkbox-input"
                            />
                            BCA
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                value="BSC"
                                checked={formData.course.includes('BSC')}
                                onChange={handleCourseChange}
                                className="checkbox-input"
                            />
                            BSC
                        </label>
                    </div>
                </div>
                <div className="form-group-file">
                    <label className="form-label">Image:</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="file-input"
                    />
                    <div>
                    {fileName && <p className="file-name">Selected File: <span className='name'> {fileName}</span></p>}</div>
                </div>
                <button type="submit" className="submit-button">Update</button>
            </form>
        </div>
        </Fragment>
    );
}

export default EditEmployee;
