// Import required modules
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize the app
const app = express();

// Middleware
app.use(bodyParser.json()); // To parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // For URL-encoded form data

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',       // Replace with your MySQL host
    user: 'root',            // Replace with your MySQL user
    password: 'Hab.jass52',    // Replace with your MySQL password
    database: 'personal_Info_db',
    port: 3310
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        console.dir(err)
    } else {
        console.log('Connected to the MySQL database');
    }
});

// API Endpoints

app.get('/', (req, res) => {
   
    res.sendFile(path.join(__dirname, './personal_info.html'));
})

// 1. Add a new person (POST /add-person)
app.post('/add-person', (req, res) => {
    const {
        full_name,
        date_of_birth,
        gender,
        email,
        phone,
        high_school,
        graduation_year,
        faculty,
        program
    } = req.body;

    const sql = `
        INSERT INTO personal_info_tb (full_name, date_of_birth, gender, email, phone, high_school, graduation_year, faculty, program)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [full_name, date_of_birth, gender, email, phone, high_school, graduation_year, faculty, program],
        (err, results) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ message: 'Error adding person', error: err.message });
            } else {
                res.status(201).json({ message: 'Person added successfully', data: results });
            }
        }
    );
});

// 4. Update a person by ID (PUT /person/:id)
app.put('/person/:id', (req, res) => {
    const { id } = req.params;
    const {
        full_name,
        date_of_birth,
        gender,
        email,
        phone,
        high_school,
        graduation_year,
        faculty,
        program
    } = req.body;

    const sql = `
        UPDATE personal_info_tb
        SET full_name = ?, date_of_birth = ?, gender = ?, email = ?, phone = ?, high_school = ?, graduation_year = ?, faculty = ?, program = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [full_name, date_of_birth, gender, email, phone, high_school, graduation_year, faculty, program, id],
        (err, results) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ message: 'Error updating person', error: err.message });
            } else if (results.affectedRows === 0) {
                res.status(404).json({ message: 'Person not found' });
            } else {
                res.status(200).json({ message: 'Person updated successfully' });
            }
        }
    );
});


// 2. Get all people (GET /people)
app.get('/people', (req, res) => {
    const sql = `SELECT * FROM personal_info_tb`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ message: 'Error fetching data', error: err.message });
        } else {
            res.status(200).json(results);
        }
    });
});

// 3. Get a person by ID (GET /person/:id)
app.get('/person/:id', (req, res) => {
    const { id } = req.params;

    const sql = `SELECT * FROM personal_info_tb WHERE id = ?`;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ message: 'Error fetching person', error: err.message });
        } else if (results.length === 0) {
            res.status(404).json({ message: 'Person not found' });
        } else {
            res.status(200).json(results[0]);
        }
    });
});

// 4. Delete a person by ID (DELETE /person/:id)
app.delete('/person/:id', (req, res) => {
    const { id } = req.params;

    const sql = `DELETE FROM personal_info_tb WHERE id = ?`;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ message: 'Error deleting person', error: err.message });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ message: 'Person not found' });
        } else {
            res.status(200).json({ message: 'Person deleted successfully' });
        }
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
