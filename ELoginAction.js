document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('#eloginForm');
    const loadingSpinner = document.querySelector('#loadingSpinner');
 
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission
        
        const username = document.querySelector('[name="eusername"]').value;
        const password = document.querySelector('[name="epassword"]').value;

        // Display the loading spinner
        loadingSpinner.classList.remove('d-none');

        // Make a POST request to the server
        fetch('/employee-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }),
        })
        .then((response) => {

            if (response.status === 200) {
                alert("Login Sucessfully");
                // Successful login, redirect to the desired page
                window.location.href = '/etask';
            } else {
                // Hide the loading spinner
                loadingSpinner.classList.add('d-none');
                // Check if there's a specific error message from the server
                response.json().then((data) => {
                    if (data.message) {
                        alert(data.message);
                    } else {
                        // If no specific message, display a generic error message
                        alert("Login failed. Please check your username and password.");
                    }
                }).catch((error) => {
                    console.error('Error parsing JSON:', error);
                    alert("Login failed. Please check your username and password.");
                });
            }
        })
        .catch((error) => {
            // Hide the loading spinner
            loadingSpinner.classList.add('d-none');
            console.error('Error:', error);
            alert("Login failed. Please check your username and password.");
        });
    });
});
