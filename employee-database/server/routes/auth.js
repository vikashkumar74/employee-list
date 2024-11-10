const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const {UserModel,EmployeeModal} = require("../model/User");

const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ name, email, password: hashedPassword });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error("Signup Error:", error); 
        res.status(500).json({ error: error.message });
    }
});


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = { id: user._id, name: user.name, email: user.email };
            res.json("Success");
            
        } else {
            res.status(401).json("Invalid email or password");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: "Failed to logout" });
        res.clearCookie("connect.sid");
        res.status(200).json("Logout successful");
    });
});

const upload = multer({
    dest: "uploads/", 
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            cb(null, true);
        } else {
            cb(new Error("Only JPG and PNG files are allowed"), false);
        }
    }
});
router.post("/CreateEmployee", upload.single("imgUpload"), async (req, res) => {
    console.log("Received request to create employee");
    try {
        const { name, email, mobileNo, destination, gender, course } = req.body;

        // Field validation
        if (!name || !email || !mobileNo || !destination || !gender || !course) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Email validation
        const existingEmployee = await EmployeeModal.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Mobile number validation
        if (!/^\d{10}$/.test(mobileNo)) {
            return res.status(400).json({ error: "Invalid mobile number" });
        }

        // Store file path if an image is uploaded
        const imgUpload = req.file ? req.file.path : null;

        // Save new employee
        const newEmployee = new EmployeeModal({
            name,
            email,
            mobileNo,
            destination,
            gender,
            course: course.split(','), 
            imgUpload
        });

        const savedEmployee = await newEmployee.save();
        res.status(201).json(savedEmployee);
    } catch (error) {
        console.error("Create Employee Error:", error);  
        res.status(500).json({ error: error.message });  
    }
});

router.get("/user", (req, res) => {
    res.status(200).json({ user: req.session.user || null });
});
router.get("/employees", async (req, res) => {
    try {
        const { name } = req.query;
        const filters = {};

        if (name) {
            filters.name = { $regex: name, $options: 'i' }; 
        }

        const employees = await EmployeeModal.find(filters);
        res.status(200).json(employees);
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE endpoint to delete an employee by ID
router.delete("/employees/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
       
        const deletedEmployee = await EmployeeModal.findByIdAndDelete(id);

        if (!deletedEmployee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
        console.error("Delete Employee Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Get an employee by ID
router.get("/employees/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await EmployeeModal.findById(id);

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        res.status(200).json(employee);
    } catch (error) {
        console.error("Error fetching employee:", error);
        res.status(500).json({ error: error.message });
    }
});

router.put("/employees/:id", upload.single("imgUpload"), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, mobileNo, destination, gender, course } = req.body;

        // Validate the required fields
        if (!name || !email || !mobileNo || !destination || !gender || !course) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if the employee exists
        const employee = await EmployeeModal.findById(id);
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Update the employee details
        employee.name = name;
        employee.email = email;
        employee.mobileNo = mobileNo;
        employee.destination = destination;
        employee.gender = gender;
        employee.course = course.split(',');  

      
        if (req.file) {
            employee.imgUpload = req.file.path;
        }

        
        const updatedEmployee = await employee.save();
        res.status(200).json(updatedEmployee);
    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
