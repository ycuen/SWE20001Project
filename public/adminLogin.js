document.addEventListener('DOMContentLoaded', function () {

    const adminloginForm = document.querySelector('#adminloginForm');
    const loadingSpinner = document.querySelector('#loadingSpinner');
    const welcomeMessage = document.querySelector('#welcomeMessage'); 

    adminloginForm.addEventListener('submit', function (event) {
        event.preventDefault(); 
    
        const admin_username = document.querySelector('[name="admin_username"]').value;
        const admin_password = document.querySelector('[name="admin_password"]').value;

        
        loadingSpinner.classList.remove('d-none');

        
        fetch('/adminlogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ admin_username, admin_password }),
            credentials: "include",
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
              
                window.location.href = '/admin';

            } else {
               
                loadingSpinner.classList.add('d-none');
                
                
                if (data.message) {
                    alert(data.message);
                } else {
                    
                    alert("Login failed. Please check your username and password.");
                }
            }
        })
        .catch((error) => {
           
            loadingSpinner.classList.add('d-none');
            console.error('Error:', error);
        });
    });
    
   });





