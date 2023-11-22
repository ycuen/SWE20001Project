
document.addEventListener('DOMContentLoaded', function () {

    const loginForm = document.querySelector('#loginForm');
    const loadingSpinner = document.querySelector('#loadingSpinner');
 
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); 
        
        const username = document.querySelector('[name="username"]').value;
        const password = document.querySelector('[name="password"]').value;




        
        loadingSpinner.classList.remove('d-none');


        
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }),
            credentials: "include",
        })
        .then((response) => response.json())
        .then((data) => {

            if (data.success) {
               alert("Login Successfully !");
            
                window.location.href = '/homepage';
          
            
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





