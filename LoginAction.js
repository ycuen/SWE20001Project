
document.addEventListener('DOMContentLoaded', function () {

    const loginForm = document.querySelector('#loginForm');
    const loadingSpinner = document.querySelector('#loadingSpinner');
 
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission
        
        const username = document.querySelector('[name="username"]').value;
        const password = document.querySelector('[name="password"]').value;




        // Display the loading spinner
        loadingSpinner.classList.remove('d-none');


        // Make a POST request to the server
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }),
            credentials: "include",// Send cookies with the request
        })
        .then((response) => response.json())
        .then((data) => {

            if (data.success) {
               
                // Redirect to the URL provided in the server response
                window.location.href = '/homepage';
                // Assuming you have the username in a variable, replace 'LoggedUsername' with the actual variable or data source
            
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





