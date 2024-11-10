import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EmployeeList.css";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, [searchTerm]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:3001/auth/employees", {
        withCredentials: true,
        params: { name: searchTerm },
      });
      setEmployees(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching employees:", error);
      navigate("/login");
    }
  };

  const deleteEmployee = async (id) => {
    await axios.delete(`http://localhost:3001/auth/employees/${id}`);
    fetchEmployees();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Fragment> <div className="header">Employee List </div>
    <div className="employee-list-container">
      

      <div className="create-container">
        <div className="total-count">Total Count: {employees.length}</div>
        <Link to="/employeeList/CreateEmployee" className="create">
             <button className="create">Create Employee</button>
        </Link>
      </div>

      <div className="table-container">
        <div className="search-container">
          <label htmlFor="search">Search</label>
          <input
            type="text"
            id="search"
            placeholder="Enter Search Keyword"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>Unique Id</th>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile No</th>
              <th>Destination</th>
              <th>Gender</th>
              <th>Course</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <tr key={employee._id}>
                  <td>{employee._id}</td>
                  <td>
                    <img src={employee.imgUpload} alt={employee.name} />
                  </td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.mobileNo}</td>
                  <td>{employee.destination}</td>
                  <td>{employee.gender}</td>
                  <td>{employee.course.join(", ")}</td>
                  <td>
                    {new Intl.DateTimeFormat("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    }).format(new Date(employee.createdDate))}
                  </td>
                  <td>
                  <Link to={`/employeeList/edit/${employee._id}`}>
                    <button className="edit"> Edit</button>
                    </Link>
                    <button
                      className="delete"
                      onClick={() => deleteEmployee(employee._id)}
                    >
                      Delete
                    </button>
                    
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">No employees found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </Fragment>
  );
}

export default EmployeeList;
