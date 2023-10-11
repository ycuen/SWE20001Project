// Function to populate the admin table
function populateEmpRewardTable() {
    // Send an AJAX request to the server to fetch data from the admin_table
    $.ajax({
        type: 'GET',
        url: '/fetch-emp_reward-data', // Update this URL to match your server route
        success: function (data) {
            console.log(data);
            // Clear existing table rows
            const emptable = document.getElementById('reward_emptable');
            const tbody = emptable.querySelector('tbody');
            tbody.innerHTML = '';

            // Populate the table with fetched data
            data.forEach(function (row) {
                const newRow = document.createElement('tr');


                newRow.innerHTML = `
                <td class="emp-id">${row.emp_id}</td>
                <td class="first-name">${row.FirstName}</td>
                <td class="last-name">${row.LastName}</td>
                
                <td class="emp_point">
                <span class="badge rounded-pill bg-dark text-white">${row.Points}</span></td>

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
// Function to populate the admin table
function populateRewardTable() {
    // Send an AJAX request to the server to fetch data from the admin_table
    $.ajax({
        type: 'GET',
        url: '/fetch-reward-data', // Update this URL to match your server route
        success: function (data) {
            console.log(data);
            // Clear existing table rows
            const rewardtable = document.getElementById('reward_table');
            const tbody = rewardtable.querySelector('tbody');
            tbody.innerHTML = '';

            // Populate the table with fetched data
            data.forEach(function (row) {
                const newRow = document.createElement('tr');


                newRow.innerHTML = `
                <td class="reward-id">${row.reward_Id}</td>
                <td class="reward-name">${row.reward_name}</td>
                <td class="reward-des">${row.reward_description}</td>
                <td class="reward-point">
                <span class="badge rounded-pill bg-info text-dark">${row.reward_point}</span>
                </td>
                <td>
                <!-- Add CRUD buttons here -->
                <button type="button" class="btn btn-outline-primary edit-btn" data-toggle="modal" data-target="#editModal">Edit</button>
                <button type="button" class="btn btn-outline-danger delete-btn">Delete</button>
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
// Function to filter the table rows based on search input
function filterTable1() {
    const searchInput = document.getElementById('emp_searchInput');
    const searchTerm = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll('#reward_emptable tbody tr');

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
$(document).ready(function () {
    // Handle form submission
    $('#createForm').submit(function (event) {
        event.preventDefault();

        // Collect form data
        const formData = {
            rewardId: $('#rewardId').val(),
            rewardName: $('#rewardName').val(),
            rewardDescription: $('#rewardDescription').val(),
            rewardPoint: $('#rewardPoint').val(),
        };

        // Send data to the server using AJAX
        $.ajax({
            type: 'POST', // Use POST method to send data
            url: '/create-reward', // Replace with your server endpoint for adding a new task
            data: formData,
            success: function (response) {
                // Handle success, e.g., close the modal and refresh the table
                $('#createModal').modal('hide');
                alert("Create new reward successfull");
                populateRewardTable(); // Refresh the table with new data

                  // Clear the input fields
                  $('#createForm')[0].reset();
            },
            error: function (error) {
                console.error('Error adding reward:', error);
                // Handle errors here if needed
            }
        });
    });

    // Show the modal when the "Assign" button is clicked
    $('.create-button').click(function () {
        $('#createModal').modal('show');
    });
});
// Attach a click event listener to a parent element (e.g., a container element that holds the buttons)
$(document).on('click', 'button.edit-btn', function () {
    // Populate the Edit Modal with the data to be edited
    const rewardId = $(this).closest('tr').find('.reward-id').text();
    const rewardName = $(this).closest('tr').find('.reward-name').text();
    const rewardDescription = $(this).closest('tr').find('.reward-des').text();
    const rewardPoint = $(this).closest('tr').find('.reward-point').text();


    // Set the values in the Edit Modal form fields
    $('#edit_rewardId').val(rewardId);
    $('#edit_rewardName').val(rewardName);
    $('#edit_rewardDescription').val(rewardDescription);
    $('#edit_rewardPoint').val(rewardPoint);

    // Show the Edit Modal
    $('#editModal').modal('show');
});

// Handle form submission for the Edit Modal
$('#editForm').submit(function (event) {
    event.preventDefault();

    // Collect the edited form data
    const editedData = {
        edit_rewardId: $('#edit_rewardId').val(),
        edit_rewardName: $('#edit_rewardName').val(),
        edit_rewardDescription: $('#edit_rewardDescription').val(),
        edit_rewardPoint: $('#edit_rewardPoint').val(),
    };
        // Convert editedData to a JSON string for alerting
        const editedDataString = JSON.stringify(editedData);

    // Send the edited data to the server using AJAX
    $.ajax({
        type: 'POST',
        url: '/edit_reward-task', // Replace with your server endpoint for editing a task
        data: editedData,
        success: function (response) {
            // Handle success, e.g., close the modal and refresh the table
            alert("Reward edited successfully");
            $('#editModal').modal('hide');
            populateRewardTable(); // Refresh the table with updated data
        },
        error: function (error) {
            console.error('Error editing reward:', error);
            // Handle errors here if needed
        },
    });
});
// Handle the click event on the delete button
$(document).on('click', '.delete-btn', function () {
    const rewardId = $(this).closest('tr').find('.reward-id').text();
    // Store the task ID in a data attribute of the confirmation modal
    $('#confirmDeleteModal').data('reward-id', rewardId);

    // Open the confirmation modal
    $('#confirmDeleteModal').modal('show');
});

// Handle the click event on the confirm delete button in the modal
$('#confirmDeleteButton').click(function () {
    const rewardId = $('#confirmDeleteModal').data('reward-id');

    // Send an AJAX request to the server to delete the task
    $.ajax({
        type: 'DELETE',
        url: `/delete-reward_task/${rewardId}`, // Replace with your server endpoint
        success: function (response) {
            // Handle success, e.g., remove the row from the table
            $(`tr[data-reward-id="${rewardId}"]`).remove();
            $('#confirmDeleteModal').modal('hide');
            alert("Reward deleted successfully");
            populateRewardTable(); // Refresh the table with updated data
        },
        error: function (error) {
            console.error('Error deleting task:', error);
            // Handle errors here if needed
        },
    });
});
// Function to filter the table rows based on search input
function filterTable2() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll('#reward_table tbody tr');

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
    populateEmpRewardTable();
    populateRewardTable();
});
// Attach event listener to search input for live filtering
const searchInput1 = document.getElementById('emp_searchInput');
searchInput1.addEventListener('input', filterTable1);

// Attach event listener to search input for live filtering
const searchInput2 = document.getElementById('searchInput');
searchInput2.addEventListener('input', filterTable2);

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