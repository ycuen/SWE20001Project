document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('#eloginForm');
    const loadingSpinner = document.querySelector('#loadingSpinner');
 
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); 
        
        const emp_username = document.querySelector('[name="eusername"]').value;
        const emp_password = document.querySelector('[name="epassword"]').value;

    
        loadingSpinner.classList.remove('d-none');

  
        fetch('/employee-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ emp_username, emp_password }),
        })
        .then((response) => {

            if (response.status === 200) {
                alert("Login Sucessfully");
              
                window.location.href = '/etask';
            } else {
              
                loadingSpinner.classList.add('d-none');
                
                response.json().then((data) => {
                    if (data.message) {
                        alert(data.message);
                    } else {
                       
                        alert("Login failed. Please check your username and password.");
                    }
                }).catch((error) => {
                    console.error('Error parsing JSON:', error);
                    alert("Login failed. Please check your username and password.");
                });
            }
        })
        .catch((error) => {
           
            loadingSpinner.classList.add('d-none');
            console.error('Error:', error);
            alert("Login failed. Please check your username and password.");
        });
    });
});
