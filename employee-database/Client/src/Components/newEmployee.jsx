import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./NewEmployee.css"; 

const NewEmployee = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobileNo: "",
        destination: "",
        gender: "",
        course: [],
        imgUpload: null
    });
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            if (checked) {
                setFormData((prevData) => ({
                    ...prevData,
                    course: [...prevData.course, value]
                }));
            } else {
                setFormData((prevData) => ({
                    ...prevData,
                    course: prevData.course.filter((course) => course !== value)
                }));
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, imgUpload: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);  
        const data = new FormData();
        
        Object.keys(formData).forEach((key) => {
            if (key === "course") {
                formData.course.forEach((c) => data.append("course", c));
            } else {
                data.append(key, formData[key]);
            }
        });

        try {
            const response = await axios.post("http://localhost:3001/auth/CreateEmployee", data, {
                headers: { "Content-Type": "multipart/form-data" }
            }).then(result => {
                if (result.status === 201) {
                    navigate("/employeelist");
                }
            });
            alert("Employee Created Successfully");
        } catch (error) {
            alert("Error creating employee: " + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);  
        }
    };

    return (
        <Fragment>
            <div className="header"> Create Employee </div>
            <form onSubmit={handleSubmit} className="employee-form" encType="multipart/form-data">
    <div className="form-row">
        <label className="form-label">Name</label>
        <input type="text" name="name" className="form-input" onChange={handleChange} required />
    </div>

    <div className="form-row">
        <label className="form-label">Email</label>
        <input type="email" name="email" className="form-input" onChange={handleChange} required />
    </div>

    <div className="form-row">
        <label className="form-label">Mobile No</label>
        <input type="tel" name="mobileNo" className="form-input" onChange={handleChange} required />
    </div>

    <div className="form-row">
        <label className="form-label">Designation</label>
        <select name="destination" className="form-select" onChange={handleChange} required>
            <option value="">Select</option>
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
        </select>
    </div>

    <div className="form-row">
        <label className="form-label">Gender</label>
        <div className="form-radio-group">
            <input type="radio" name="gender" value="M" onChange={handleChange} required />
            <label className="radio-label">Male</label>
            <input type="radio" name="gender" value="F" onChange={handleChange} required />
            <label className="radio-label">Female</label>
        </div>
    </div>

    <div className="form-row">
        <label className="form-label">Course</label>
        <div className="form-checkbox-group">
            <input type="checkbox" name="course" value="MCA" onChange={handleChange} />
            <label className="checkbox-label">MCA</label>
            <input type="checkbox" name="course" value="BCA" onChange={handleChange} />
            <label className="checkbox-label">BCA</label>
            <input type="checkbox" name="course" value="BSC" onChange={handleChange} />
            <label className="checkbox-label">BSC</label>
        </div>
    </div>

    <div className="form-row">
        <label className="form-label">Image Upload</label>
        <input type="file" name="imgUpload" accept=".jpg,.png" className="form-input" onChange={handleFileChange} />
    </div>

    <button type="submit" className="submit-button">
        {loading ? "Submitting..." : "Submit"}  
    </button>
</form>

        </Fragment>
    );
};

export default NewEmployee;
