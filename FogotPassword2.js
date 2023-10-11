$(document).ready(function () {
    $('#forgotPasswordForm2').submit(function (e) {
        e.preventDefault();

        // Get the form data
        const formData = {
            username: $('#username').val(),
            oldPassword: $('#oldPassword').val(),
            newPassword: $('#newPassword').val()
        };

          // Display the loading spinner
        loadingSpinner.classList.remove('d-none');
          
        // Send an AJAX request to the server to handle the password reset
        $.ajax({
            type: 'POST',
            url: '/forgot-password2',
            data: JSON.stringify(formData),
            contentType: 'application/json',
            success: function (response) {
                // Hide the loading spinner
                loadingSpinner.classList.add('d-none');
                alert("Password reset successful");
                // Password reset successful, you can redirect the user to a login page
                window.location.href = '/elogin';
            },
            error: function (error) {
                 // Hide the loading spinner
                loadingSpinner.classList.add('d-none');
                // Handle errors (e.g., display an error message to the user)
                console.error('Error:', error.responseText);
                // Display an error message to the user (e.g., in a div element)
                $('#errorMessage').text(error.responseText);

                // Check for specific error messages and display alerts or messages accordingly
                if (error.status === 401) {
                    if (error.responseText === 'Invalid old password') {
                        alert('Invalid old password. Please check your old password.');
                    } else if (error.responseText === 'Invalid username') {
                        alert('Username not found in the database. Please check your username.');
                    }
                     else {
                        // Handle other error conditions as needed
                    }
                }
                if(error.status==400)
                {
                    if(error.responseText === 'New password must have at least 8 characters')
                    {
                        alert('New password must have at least 8 characters');
                    }
                    else if(error.responseText === 'New password must contain a combination of alphabets, numbers, and special characters'
                    )
                    {
                        alert('New password must contain a combination of alphabets, numbers, and special characters');
                    }
                    else
                    {

                    }
                }
            }
        });
    });
});
 // Add a click event handler to the "Return to Login" link
 $('#returnToLogin').click(function () {
          // Display the loading spinner
          loadingSpinner.classList.remove('d-none');

    // Redirect the user to the login page
    window.location.href = '/elogin';
    
});
