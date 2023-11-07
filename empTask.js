function populateEmployeeTable() {
    // Send an AJAX request to the server to fetch data from the group-specific table
    $.ajax({
        type: 'GET',
        url: `/fetch-emp-tasks`, // Update this URL to match your server route for fetching group-specific data
        success: function (data) {
            // Clear existing table rows
            const empTable = document.getElementById('emp_Table');
            const tbody = empTable.querySelector('tbody');
            tbody.innerHTML = '';

            // Populate the table with fetched data
            data.forEach(function (row) {
                const newRow = document.createElement('tr');
                // Format the date and time fields if needed
                // ...

                newRow.innerHTML = `
                <td class="task-id">${row.task_id}</td>
                <td class="task-name">${row.task_name}</td>
                <td class="task-description">${row.task_description}</td>
                <td class="created-time">${row.created_time}</td>
                <td class="due-date">${row.due_date}</td>
                <td>
                <!-- Add badges to show the task status -->
                <span class="badge rounded-pill ${
                    row.is_complete === 0
                      ? 'bg-primary'
                      : row.is_complete === 1
                      ? 'bg-info'
                      : row.is_complete === 2
                      ? 'bg-warning'
                      : row.is_complete === 3
                      ? 'bg-danger'
                      : row.is_complete === 4
                      ? 'bg-success'
                      : ''
                  }">
                    ${
                      row.is_complete === 0
                        ? 'New'
                        : row.is_complete === 1
                        ? 'Accepted'
                        : row.is_complete === 2
                        ? 'In Pending'
                        : row.is_complete === 3
                        ? 'Rejected'
                        : row.is_complete === 4
                        ? 'Completed'
                        : ''
                    }
                  </span>
            </td>
                <td>
                    <!-- Add CRUD buttons here -->
                    <button type="button" class="btn btn-outline-success accept-btn" ${row.is_complete === 0 ? '' : 'disabled'}>Accept</button>
                    <button type="button" class="btn btn-outline-success complete-btn" ${row.is_complete === 1 ? '' : 'disabled'}>Complete</button>
                    <button type="button" class="btn btn-outline-info info-btn-emp">Review</button>
                </td>
                `;
                tbody.appendChild(newRow);
            });
        },
        error: function (error) {
            console.error('Error fetching data:', error);
            // Handle errors here if needed
        }
    });
}
function getEmpUsername() {
    fetch('/getEmpUsername', {
        method: 'GET',
        credentials: 'include' // Include cookies in the request
    })
    .then(response => response.json())
    .then(data => {
        const empUsername = data.emp_username;
        if (empUsername) {
            // Update the welcome message with the admin username
            const welcomeMessage = document.getElementById('welcomeEmployee');
            welcomeMessage.textContent = 'Welcome back ' + empUsername;
        }
    })
    .catch(error => {
        console.error('Error fetching admin username:', error);
    });
}
window.addEventListener('load', getEmpUsername);

document.getElementById('emp_Table').addEventListener('click', function (event) {
    if (event.target.classList.contains('accept-btn')) {
        const row = event.target.closest('tr');
        const taskId = row.querySelector('.task-id').textContent;

        // Show the confirmation modal when the "Delete" button is clicked
        $('#confirmAcceptModalEmp').modal('show');

        // Attach a click event to the "Delete" button in the modal
        $('#confirmAcceptButtonStaff').off('click').on('click', function () {
            // Call a function to delete the staff member
            acceptTaskEmp(taskId);
        });
    }
});
function acceptTaskEmp(taskId)
{
 // Send an AJAX request to delete the staff member
 $.ajax({
    type: 'POST',
    url: '/accept-task',
    data: { taskId },
    success: function (response) {
        if (response.success) {
            alert("Task is accepted successfull.");
            // Close the confirmation modal
            $('#confirmAcceptModalEmp').modal('hide');
            populateEmployeeTable();
        } else {
            // Handle errors here
            alert('Error accepting the task.');
        }
    },
    error: function (error) {
        console.error('Error accepting task:', error);
        // Handle errors here if needed
    }
});
}
document.getElementById('emp_Table').addEventListener('click', function (event) {
    if (event.target.classList.contains('complete-btn')) {
        const row = event.target.closest('tr');
        const taskId = row.querySelector('.task-id').textContent;

        // Show the confirmation modal when the "Complete" button is clicked
        $('#confirmCompleteModalEmp').modal('show');

        // Attach a click event to the modal's confirmation button
        $('#confirmCompleteButtonEmp').off('click').on('click', function () {
            // Call a function to upload the file and complete the task
            completeTaskEmp(taskId);
        });
    }
});
function completeTaskEmp(taskId) {
    $.ajax({
        type: 'POST',
        url: '/complete-task-emp',
        data: { taskId },
        success: function (response) {
            if (response.success) {
                alert("Task is completed successfull.");
                // Close the confirmation modal
                $('#confirmCompleteModalEmp').modal('hide');
                populateEmployeeTable();
            } else {
                // Handle errors here
                alert('Error completing the task.');
            }
        },
        error: function (error) {
            console.error('Error completing task:', error);
            // Handle errors here if needed
        }
    });
  
}
$(document).on('click', '.info-btn-emp', function () {
    const taskId = $(this).closest('tr').find('.task-id').text();
   DisplayReviewHistory(taskId);
   $('#reviewModalEmp').modal('show');
});
// Function to fetch and display review history
function DisplayReviewHistory(taskId) {
    // Fetch the review history for the task from the server using AJAX
    $.ajax({
        type: 'GET',
        url: `/get-review-emp/${taskId}`, // Replace with your server endpoint
        success: function (reviews) {
            // Clear the previous review history and populate with new data
            const reviewList = $('#reviewListEmp');
            reviewList.empty();
            if (reviews.length > 0) {
                reviews.forEach(function (review) {
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item';
                    listItem.textContent = review.reviewText;
                    reviewList.append(listItem);
                });
            } else {
                const noReviewsMessage = document.createElement('p');
                noReviewsMessage.textContent = 'No reviews available for this task.';
                reviewList.append(noReviewsMessage);
            }

            // Open the review modal
            $('#reviewModalEmp').modal('show');
        },
        error: function (error) {
            console.error('Error fetching review history:', error);
            // Handle errors here if needed
        },
    });
}
 
function filterTableEmp() {
    const searchInput = document.getElementById('searchInput_emp');
    const searchTerm = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll('#emp_Table tbody tr');

    rows.forEach(function (row) {
        const cells = row.querySelectorAll('td');
        let found = false;

        cells.forEach(function (cell) {
            const text = cell.textContent.toLowerCase();

            if (text.includes(searchTerm)) {
                found = true;
            }
        });

        if (found) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}
// Call the function to populate the table and check session status when the page loads
$(document).ready(function () {
    populateEmployeeTable();

});
const searchInputEmp = document.getElementById('searchInput_emp');
searchInputEmp.addEventListener('input', filterTableEmp);
setInterval(populateEmployeeTable, 5000); // 3000 milliseconds = 3 seconds

function logoutEmp() {
    shouldDisplayAlert = false;
    fetch('/logout-emp', {
        method: 'GET',
        credentials: 'same-origin' // Include cookies in the request
    })
    .then((response) => {
        if (response.redirected) {
            // If the server redirected to the login page, redirect the user
            window.location.href = '/elogin';
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
// Define a function to refresh the page
function refreshPage() {
    location.reload(); // Reload the current page
}

// Set an interval to refresh the page every 30 minutes (30 minutes * 60 seconds * 1000 milliseconds)
const refreshInterval = 30 * 60 * 1000;

// Call the refreshPage function at the specified interval
setInterval(refreshPage, refreshInterval);
