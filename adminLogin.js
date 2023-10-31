document.addEventListener('DOMContentLoaded', function () {

    const adminloginForm = document.querySelector('#adminloginForm');
    const loadingSpinner = document.querySelector('#loadingSpinner');
    const welcomeMessage = document.querySelector('#welcomeMessage'); 

    adminloginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission
    
        const admin_username = document.querySelector('[name="admin_username"]').value;
        const admin_password = document.querySelector('[name="admin_password"]').value;

        // Display the loading spinner
        loadingSpinner.classList.remove('d-none');

        // Make a POST request to the server
        fetch('/adminlogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ admin_username, admin_password }),
            credentials: "include",// Send cookies with the request
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                // Redirect to the URL provided in the server response
                window.location.href = '/admin';

            } else {
                // Hide the loading spinner
                loadingSpinner.classList.add('d-none');
                
                // Check if there's a specific error message from the server
                if (data.message) {
                    alert(data.message);
                } else {
                    // If no specific message, display a generic error message
                    alert("Login failed. Please check your username and password.");
                }
            }
        })
        .catch((error) => {
            // Hide the loading spinner
            loadingSpinner.classList.add('d-none');
            console.error('Error:', error);
        });
    });
    
   });





