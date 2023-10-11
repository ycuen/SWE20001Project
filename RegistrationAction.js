document.getElementById("registrationForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
    
    const firstNameInput = document.getElementById("firstname");
    const lastNameInput = document.getElementById("lastname");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    // Validate the "First Name" and "Last Name" fields
    if (!isValidAlphabeticInput(firstNameInput)) {
        alert("First name should only contain alphabetic characters.");
        return;
    }

    if (!isValidAlphabeticInput(lastNameInput)) {
        alert("Last name should only contain alphabetic characters.");
        return;
    }

    // Validate the password length
    if (!isValidPasswordLength(passwordInput)) {
        alert("Password must be at least 8 characters.");
        return;
    }

    // Validate the password combination
    if (!isValidPasswordCombination(passwordInput)) {
        alert("Password must contain a combination of alphabetic characters, numbers, and special characters.");
        return;
    }

    const username = usernameInput.value;

    // Check if the username exists by sending a GET request to a server endpoint
    fetch(`/check-username/${username}`)
        .then(response => response.json())
        .then(data => {
            if (data.usernameExists) {
                alert("Username already exists. Please choose another username.");
            } else {
                // If the username is available, proceed with registration
                const formData = {
                    FirstName: firstNameInput.value,
                    LastName: lastNameInput.value,
                    username: username,
                    password: passwordInput.value
                };

                // Send a POST request to the server for registration
                fetch("/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.message === "Registration successful") {
                        alert("Registration successful. You can now log in.");
                        window.location.href='/elogin';
                        // You can optionally redirect to a login page here
                    } else {
                        alert("Registration failed. Please try again.");
                    }
                })
                .catch(error => {
                    console.error("Error during registration:", error);
                    alert("Registration failed. Please try again later.");
                });
            }
        })
        .catch(error => {
            console.error("Error checking username availability:", error);
            alert("Error checking username availability. Please try again later.");
        });
});

function isValidAlphabeticInput(inputElement) {
    // Regular expression to allow only alphabetic characters
    const alphabeticRegex = /^[A-Za-z]+$/;
    return alphabeticRegex.test(inputElement.value);
}

function isValidPasswordLength(passwordElement) {
    // Password must be at least 8 characters
    return passwordElement.value.length >= 8;
}

function isValidPasswordCombination(passwordElement) {
    // Password must contain a combination of alphabetic characters, numbers, and special characters
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/;
    return passwordRegex.test(passwordElement.value);
}
