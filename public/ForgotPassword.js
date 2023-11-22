$(document).ready(function () {
    $('#forgotPasswordForm').submit(function (e) {
        e.preventDefault();

        const formData = {
            staff_username: $('#username').val(),
            staff_oldPassword: $('#oldPassword').val(),
            staff_newPassword: $('#newPassword').val()
        };

         
        loadingSpinner.classList.remove('d-none');
          
       
        $.ajax({
            type: 'POST',
            url: '/forgot-password',
            data: JSON.stringify(formData),
            contentType: 'application/json',
            success: function (response) {
               
                loadingSpinner.classList.add('d-none');
                alert("Password reset successful");
               
                window.location.href = '/login';
            },
            error: function (error) {
                
                loadingSpinner.classList.add('d-none');
    
                console.error('Error:', error.responseText);
             
                $('#errorMessage').text(error.responseText);

                
                if (error.status === 401) {
                    if (error.responseText === 'Invalid old password') {
                        alert('Invalid old password. Please check your old password.');
                    } else if (error.responseText === 'Invalid username') {
                        alert('Username not found in the database. Please check your username.');
                    }
                     else {
                       
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

