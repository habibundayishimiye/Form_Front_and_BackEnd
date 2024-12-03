const apiBase = "http://localhost:3000"; // Backend Base URL
const resultOutput = document.getElementById("resultOutput");

// Form submission handler (Add / Update)
document.getElementById("personForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const id = document.getElementById("personId").value.trim();
    const data = {
        full_name: document.getElementById("fullName").value,
        date_of_birth: document.getElementById("dateOfBirth").value,
        gender: document.getElementById("gender").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        high_school: document.getElementById("highSchool").value,
        graduation_year: document.getElementById("graduationYear").value,
        faculty: document.getElementById("faculty").value,
        program: document.getElementById("program").value,
    };

    const url = id ? `${apiBase}/person/${id}` : `${apiBase}/add-person`;
    const method = id ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        resultOutput.textContent = JSON.stringify(result, null, 2);
    } catch (error) {
        resultOutput.textContent = `Error: ${error.message}`;
    }
});

// Fetch all people
document.getElementById("getAll").addEventListener("click", async () => {
    try {
        const response = await fetch(`${apiBase}/people`);
        const result = await response.json();
        resultOutput.textContent = JSON.stringify(result, null, 2);
    } catch (error) {
        resultOutput.textContent = `Error: ${error.message}`;
    }
});

// Fetch a person by ID
document.getElementById("getById").addEventListener("click", async () => {
    const id = document.getElementById("fetchId").value.trim();
    if (!id) return alert("Please provide a valid ID");

    try {
        const response = await fetch(`${apiBase}/person/${id}`);
        const result = await response.json();
        resultOutput.textContent = JSON.stringify(result, null, 2);
    } catch (error) {
        resultOutput.textContent = `Error: ${error.message}`;
    }
});

// Delete a person by ID
document.getElementById("deleteById").addEventListener("click", async () => {
    const id = document.getElementById("deleteId").value.trim();
    if (!id) return alert("Please provide a valid ID");

    try {
        const response = await fetch(`${apiBase}/person/${id}`, {
            method: "DELETE",
        });

        const result = await response.json();
        resultOutput.textContent = JSON.stringify(result, null, 2);
    } catch (error) {
        resultOutput.textContent = `Error: ${error.message}`;
    }
});
