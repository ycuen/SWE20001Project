let shouldDisplayAlert = true;

// Function to populate the admin table
function populateAdminTable() {
    // Send an AJAX request to the server to fetch data from the admin_table
    $.ajax({
        type: 'GET',
        url: '/fetch-admin-data', // Update this URL to match your server route
        success: function (data) {
            console.log(data);
            // Clear existing table rows
            const adminTable = document.getElementById('adminTable');
            const tbody = adminTable.querySelector('tbody');
            tbody.innerHTML = '';

            // Populate the table with fetched data
            data.forEach(function (row) {
                const newRow = document.createElement('tr');
                 // Format the date and time fields
                 const startTime = new Date(row.Start_Time);
                 const dueDate = new Date(row.Due_Date);
                 let status = 'New'; // Default status

                 // Assuming you have some logic to determine if the task is completed
                 if (row.Is_Completed === 1) {
                     status = 'Completed';
                 }

                newRow.innerHTML = `
                <td class="task-id">${row.TaskId}</td>
                <td class="task-name">${row.Task_Name}</td>
                <td class="task-description">${row.Task_Description}</td>
                <td class="assigned-to">${row.Assigned_To}</td>
                <td class="start-time">${startTime.toLocaleString()}</td>
                <td class="due-date">${dueDate.toLocaleString()}</td>
                <td>
                <!-- Add badges to show the task status -->
                <span class="badge rounded-pill ${status === 'Completed' ? 'bg-success' : 'bg-primary'}">${status}</span>
            </td>
                <td>
                    <!-- Add CRUD buttons here -->
                    <button type="button" class="btn btn-outline-primary edit-btn" data-toggle="modal" data-target="#editModal">Edit</button>
                    <button type="button" class="btn btn-outline-danger delete-btn">Delete</button>
                    <button type="button" class="btn btn-outline-success complete-btn">Complete</button>
                    <button type="button" class="btn btn-outline-info info-btn">Review</button>
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



$(document).ready(function () {
    // Handle form submission
    $('#assignForm').submit(function (event) {
        event.preventDefault();

        // Collect form data
        const formData = {
            taskId: $('#taskId').val(),
            taskName: $('#taskName').val(),
            taskDescription: $('#taskDescription').val(),
            assignedTo: $('#assignedTo').val(),
            startTime: $('#startTime').val(),
            dueDate: $('#dueDate').val(),
        };

        // Send data to the server using AJAX
        $.ajax({
            type: 'POST', // Use POST method to send data
            url: '/add-task', // Replace with your server endpoint for adding a new task
            data: formData,
            success: function (response) {
                // Handle success, e.g., close the modal and refresh the table
                $('#assignModal').modal('hide');
                alert("Assign new task successfull");
                populateAdminTable(); // Refresh the table with new data

                  // Clear the input fields
                  $('#assignForm')[0].reset();
            },
            error: function (error) {
                console.error('Error adding task:', error);
                // Handle errors here if needed
            }
        });
    });

    // Show the modal when the "Assign" button is clicked
    $('.account-button').click(function () {
        $('#accountModal').modal('show');
    });
});
  // Show the modal when the "Assign" button is clicked
  $('.custom-button').click(function () {
    $('#assignModal').modal('show');
});

// Attach a click event listener to a parent element (e.g., a container element that holds the buttons)
$(document).on('click', 'button.edit-btn', function () {
    // Populate the Edit Modal with the data to be edited
    const taskId = $(this).closest('tr').find('.task-id').text();
    const taskName = $(this).closest('tr').find('.task-name').text();
    const taskDescription = $(this).closest('tr').find('.task-description').text();
    const assignedTo = $(this).closest('tr').find('.assigned-to').text();
    const startTime = $(this).closest('tr').find('.start-time').text();
    const dueDate = $(this).closest('tr').find('.due-date').text();

    // Set the values in the Edit Modal form fields
    $('#editTaskId').val(taskId);
    $('#editTaskName').val(taskName);
    $('#editTaskDescription').val(taskDescription);
    $('#editAssignedTo').val(assignedTo);
    $('#editStartTime').val(startTime);
    $('#editDueDate').val(dueDate);
    // Show the Edit Modal
    $('#editModal').modal('show');
});

// Handle form submission for the Edit Modal
$('#editForm').submit(function (event) {
    event.preventDefault();

    // Collect the edited form data
    const editedData = {
        taskId: $('#editTaskId').val(),
        taskName: $('#editTaskName').val(),
        taskDescription: $('#editTaskDescription').val(),
        assignedTo: $('#editAssignedTo').val(),
        startTime: $('#editStartTime').val(),
        dueDate: $('#editDueDate').val(),
    };
        // Convert editedData to a JSON string for alerting
        const editedDataString = JSON.stringify(editedData);

    // Send the edited data to the server using AJAX
    $.ajax({
        type: 'POST',
        url: '/edit-task', // Replace with your server endpoint for editing a task
        data: editedData,
        success: function (response) {
            // Handle success, e.g., close the modal and refresh the table
            alert("Task edited successfully");
            $('#editModal').modal('hide');
            populateAdminTable(); // Refresh the table with updated data
        },
        error: function (error) {
            console.error('Error editing task:', error);
            // Handle errors here if needed
        },
    });
});
// Handle the click event on the delete button
$(document).on('click', '.delete-btn', function () {
    const taskId = $(this).closest('tr').find('.task-id').text();
    // Store the task ID in a data attribute of the confirmation modal
    $('#confirmDeleteModal').data('task-id', taskId);

    // Open the confirmation modal
    $('#confirmDeleteModal').modal('show');
});

// Handle the click event on the confirm delete button in the modal
$('#confirmDeleteButton').click(function () {
    const taskId = $('#confirmDeleteModal').data('task-id');

    // Send an AJAX request to the server to delete the task
    $.ajax({
        type: 'DELETE',
        url: `/delete-task/${taskId}`, // Replace with your server endpoint
        success: function (response) {
            // Handle success, e.g., remove the row from the table
            $(`tr[data-task-id="${taskId}"]`).remove();
            $('#confirmDeleteModal').modal('hide');
            alert("Task deleted successfully");
            populateAdminTable(); // Refresh the table with updated data
        },
        error: function (error) {
            console.error('Error deleting task:', error);
            // Handle errors here if needed
        },
    });
});
// Attach a click event listener to the complete button
$(document).on('click', '.complete-btn', function () {
    const taskId = $(this).closest('tr').find('.task-id').text();
    // Store the task ID in a data attribute of the confirmation modal
    $('#confirmCompleteModal').data('task-id', taskId);

    // Open the confirmation modal
    $('#confirmCompleteModal').modal('show');
});

// Handle the click event on the confirm complete button in the modal
$('#confirmCompleteButton').click(function () {
    const taskId = $('#confirmCompleteModal').data('task-id');

    // Send an AJAX request to the server to mark the task as completed
    $.ajax({
        type: 'POST',
        url: `/complete-task/${taskId}`, // Replace with your server endpoint
        success: function (response) {
            // Handle success, e.g., update the button text and style

            $('#confirmCompleteModal').modal('hide');
             // Remove the row from the table
            alert("Task marked as completed successfully");

            populateAdminTable(); // Refresh the table with updated data
        },
        error: function (error) {
            console.error('Error marking task as completed:', error);
            // Handle errors here if needed
        },
    });
});

// Function to fetch and display review history
function fetchAndDisplayReviewHistory(taskId) {
    // Fetch the review history for the task from the server using AJAX
    $.ajax({
        type: 'GET',
        url: `/get-review-history/${taskId}`, // Replace with your server endpoint
        success: function (reviews) {
            // Clear the previous review history and populate with new data
            const reviewList = $('#reviewList');
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
            $('#reviewModal').modal('show');
        },
        error: function (error) {
            console.error('Error fetching review history:', error);
            // Handle errors here if needed
        },
    });
}

// Attach a click event listener to the "Review" button
$(document).on('click', '.info-btn', function () {
    const taskId = $(this).closest('tr').find('.task-id').text();
    fetchAndDisplayReviewHistory(taskId);

    // Set the data-task-id attribute on the modal content element
    $('#reviewModal .modal-content').data('task-id', taskId);

});
// Attach a click event listener to the "Submit Review" button within the review modal
$('#submitReview').click(function (event) {
    const taskId = $('#reviewModal .modal-content').data('task-id');
    const reviewText = $('#reviewText').val();

    // Send the review data to the server using AJAX
    $.ajax({
        type: 'POST',
        url: `/submit-review/${taskId}`, // Replace with your server endpoint
        data: { reviewText: reviewText },
        success: function (response) {
            // Clear the review input box
            $('#reviewText').val('');

            // After submitting a review, you can optionally refresh the review history
            fetchAndDisplayReviewHistory(taskId);

            // Note: Remove the following line to keep the modal open
        //    $('#reviewModal').modal('hide'); // This line closes the modal

            // If you want to keep the modal open, remove the line above
        },
        error: function (error) {
            console.error('Error submitting review:', error);
            // Handle errors here if needed
        },
    });

    // Prevent the default form submission behavior
    event.preventDefault();
});

// Function to filter the table rows based on search input
function filterTable() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll('#adminTable tbody tr');

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
    populateAdminTable();
   
});

// Attach event listener to search input for live filtering
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', filterTable);
function logout() {
    shouldDisplayAlert = false;
    fetch('/logout', {
        method: 'GET',
        credentials: 'same-origin' // Include cookies in the request
    })
    .then((response) => {
        if (response.redirected) {
            // If the server redirected to the login page, redirect the user
            window.location.href = response.url;
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

