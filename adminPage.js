let sortAscending = true;
// Function to populate the admin table
function populateStaffTable() {
    // Send an AJAX request to the server to fetch data from the admin_table
    $.ajax({
        type: 'GET',
        url: '/fetch-admin_staff-data', // Update this URL to match your server route
        success: function (data) {

            // Clear existing table rows
            const staff_table = document.getElementById('staff_table');
            const tbody = staff_table.querySelector('tbody');
            tbody.innerHTML = '';

            // Populate the table with fetched data
            data.forEach(function (row) {
                const newRow = document.createElement('tr');


                newRow.innerHTML = `
                <td class="staff_id">${row.staff_id}</td>
                <td class="staff_name">${row.staff_name}</td>
                <td class="staff_username">${row.staff_username}</td>
                <td class="staff_group">${row.staff_group}</td>
                <td>
                <button type="button" class="btn btn-outline-info edit-btn">Edit</button>
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
function getAdminUsername() {
    fetch('/getAdminUsername', {
        method: 'GET',
        credentials: 'include' // Include cookies in the request
    })
    .then(response => response.json())
    .then(data => {
        const adminUsername = data.admin_username;
        if (adminUsername) {
            // Update the welcome message with the admin username
            const welcomeMessage = document.getElementById('welcomeMessage');
            welcomeMessage.textContent = 'Welcome back ' + adminUsername;
        }
    })
    .catch(error => {
        console.error('Error fetching admin username:', error);
    });
}
window.addEventListener('load', getAdminUsername);
// Attach a click event listener to the sort icons for the Staff table
$(document).on('click', '#staff_table .sort-icon', function () {
    const column = $(this).data('column');
    sortTable('staff_table', column);
});

// Attach a click event listener to the sort icons for the Employee table
$(document).on('click', '#emp_table .sort-icon', function () {
    const column = $(this).data('column');
    sortTable('emp_table', column);
});
function sortTable(tableId, column) {
    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    // Determine sorting order
    sortAscending = !sortAscending;

    // Sort rows based on the column data
    rows.sort((a, b) => {
        const aValue = a.querySelector(`td.${column}`).textContent;
        const bValue = b.querySelector(`td.${column}`).textContent;

        if (column === 'staff_id' || column === 'emp_id') {
            // Convert to integers for the "staff_id" and "emp_id" columns
            const aIntValue = parseInt(aValue, 10);
            const bIntValue = parseInt(bValue, 10);

            if (sortAscending) {
                return aIntValue - bIntValue;
            } else {
                return bIntValue - aIntValue;
            }
        } else {
            if (sortAscending) {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        }
    });

    // Rebuild the table with sorted rows
    tbody.innerHTML = '';
    rows.forEach((row) => tbody.appendChild(row));
}


$(document).ready(function () {
    // When the dropdown selection changes
    $('#staffGroup').on('change', function () {
        const selectedGroup = $(this).val();

        // Fetch group data based on the selected group name
        $.ajax({
            type: 'GET',
            url: `/fetch-group-table/${selectedGroup}`, // Pass the selected group name
            success: function (data) {
                // Populate your table with the fetched data
                // This part depends on your table structure and how you want to display the data
            },
            error: function (error) {
                console.error('Error fetching group data:', error);
                // Handle errors here if needed
            }
        });
    });
});
// When the form is submitted
$('#createStaffForm').on('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting

    const staffId = $('#staffID').val();
    const staffName = $('#staffName').val();
    const staffUsername = $('#staffUsername').val();
    const staffPassword = $('#staffPassword').val();
    const staffGroup = $('#staffGroup').val();

    // Send an AJAX request to check if the group is already assigned
    $.ajax({
        type: 'POST',
        url: '/check-group',
        data: { staffGroup },
        success: function (response) {
            if (response.isAssigned) {
                // Group is already assigned to another staff, show an error message
                alert('This group is already assigned to another staff.');
                document.getElementById('createStaffForm').reset(); 
            } else {
                // Group is not assigned to another staff, proceed with staff creation
                createStaffMember(staffId, staffName, staffUsername, staffPassword, staffGroup);
            }
        },
        error: function (error) {
            console.error('Error checking group:', error);
            document.getElementById('createStaffForm').reset(); 
            // Handle errors here if needed
        }
    });
});

// Function to create a staff member
function createStaffMember(staffId, staffName, staffUsername, staffPassword, staffGroup) {
    // Send an AJAX request to create the staff member
    $.ajax({
        type: 'POST',
        url: '/create-staff',
        data: { staffId, staffName, staffUsername, staffPassword, staffGroup },
        success: function (response) {
            if (response.success) {
                // Staff created successfully, close the modal or take appropriate action
                $('#createStaffModal').modal('hide');
                alert('Staff created successfully !');
                // Reset the form after a successful create or delete operation
                document.getElementById('createStaffForm').reset();   
                // You may want to update the staff table
                populateStaffTable();
            } else {
                // Handle errors here
                alert('Error creating the staff member.');
            
            }
        },
        error: function (error) {
            if(error.status===400){
                if(error.status === 400 && error.responseJSON && error.responseJSON.message === 'Staff ID or Username already exists.')
                {
                    alert('Staff ID or Username already exists.');
                    document.getElementById('createStaffForm').reset(); 
                }
            }
            console.error('Error creating staff member:', error);
            document.getElementById('createStaffForm').reset(); 
            // Handle errors here if needed
           
        }
    });
}
// Attach a click event listener to a parent element (e.g., a container element that holds the buttons)
$(document).on('click', 'button.edit-btn', function () {
    // Populate the Edit Modal with the data to be edited
    const staffId = $(this).closest('tr').find('.staff_id').text();
    const assignedTo = $(this).closest('tr').find('.staff_group').text();


    // Set the values in the Edit Modal form fields
    $('#edit_staffID').val(staffId);
    $('#edit_staffGroup').val(assignedTo);

    // Show the Edit Modal
    $('#editStaffModal').modal('show');
});

// Handle form submission for the Edit Modal
$('#editStaffForm').submit(function (event) {
    event.preventDefault();

    // Collect the edited form data
    const editedData = {
        staffId: $('#edit_staffID').val(),
        assignedTo: $('#edit_staffGroup').val(),
    };

    // Send the edited data to the server using AJAX
    $.ajax({
        type: 'POST',
        url: '/edit-staff-group', // Replace with your server endpoint for editing a task
        data: editedData,
        success: function (response) {
            // Handle success, e.g., close the modal and refresh the table
            alert("Group edited successfully");
            $('#editStaffModal').modal('hide');
            populateStaffTable(); // Refresh the table with updated data
        },
        error: function (error) {
            console.error('Error editing group:', error);
            // Handle errors here if needed
        },
    });
});
// Event delegation: Listen for "Delete" button clicks
document.getElementById('staff_table').addEventListener('click', function (event) {
    if (event.target.classList.contains('delete-btn')) {
        // Find the parent row and staff ID
        const row = event.target.closest('tr');
        const staffId = row.querySelector('.staff_id').textContent;

        // Show the confirmation modal when the "Delete" button is clicked
        $('#confirmDeleteModal').modal('show');

        // Attach a click event to the "Delete" button in the modal
        $('#confirmDeleteButton').off('click').on('click', function () {
            // Call a function to delete the staff member
            deleteStaffMember(staffId);
        });
    }
});

// Function to delete the staff member
function deleteStaffMember(staffId) {
    // Send an AJAX request to delete the staff member
    $.ajax({
        type: 'POST',
        url: '/delete-staff',
        data: { staffId },
        success: function (response) {
            if (response.success) {
                // Close the confirmation modal
                $('#confirmDeleteModal').modal('hide');

                populateStaffTable();
            } else {
                // Handle errors here
                alert('Error deleting the staff member.');
            }
        },
        error: function (error) {
            console.error('Error deleting staff member:', error);
            // Handle errors here if needed
        }
    });
}

// Function to populate the admin table
function populateEmployeeTable() {
    // Send an AJAX request to the server to fetch data from the admin_table
    $.ajax({
        type: 'GET',
        url: '/fetch-admin_emp-data', // Update this URL to match your server route
        success: function (data) {

            // Clear existing table rows
            const staff_table = document.getElementById('emp_table');
            const tbody = staff_table.querySelector('tbody');
            tbody.innerHTML = '';

            // Populate the table with fetched data
            data.forEach(function (row) {
                const newRow = document.createElement('tr');


                newRow.innerHTML = `
                <td class="emp_id">${row.emp_id}</td>
                <td class="emp_name">${row.emp_name}</td>
                <td class="emp_username">${row.emp_username}</td>
                <td class="emp_group">${row.emp_group}</td>
                <td>
                <button type="button" class="btn btn-outline-info edit-btn-emp">Edit</button>
                <button type="button" class="btn btn-outline-danger delete-btn-emp">Delete</button>
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
    // When the dropdown selection changes
    $('#staffGroup').on('change', function () {
        const selectedGroup = $(this).val();

        // Fetch group data based on the selected group name
        $.ajax({
            type: 'GET',
            url: `/fetch-group-table/${selectedGroup}`, // Pass the selected group name
            success: function (data) {
                // Populate your table with the fetched data
                // This part depends on your table structure and how you want to display the data
            },
            error: function (error) {
                console.error('Error fetching group data:', error);
                // Handle errors here if needed
            }
        });
    });
});

$('#createEmployeeForm').on('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting
    const empId = $('#emp_id').val();
    const empName = $('#emp_name').val();
    const empUsername = $('#emp_username').val();
    const empPassword = $('#emp_password').val();
    const empGroup = $('#emp_group').val();

    // Send an AJAX request to create the staff member
    $.ajax({
        type: 'POST',
        url: '/create-employee',
        data: { empId, empName, empUsername, empPassword, empGroup},
        success: function (response) {
            if (response.success) {
                // Staff created successfully, close the modal or take appropriate action
                $('#createEmployeeModal').modal('hide');
                alert('Employee created successfully !');
                // Reset the form after a successful create or delete operation
                document.getElementById('createEmployeeForm').reset();   
                // You may want to update the staff table
                populateEmployeeTable();
            } else {
                // Handle errors here
                alert('Error creating the employee member.');
            }
        },
        error: function (error) {
            if(error.status===400){
                if(error.status === 400 && error.responseJSON && error.responseJSON.message === 'Employee ID or Username already exists.')
                {
                    alert('Employee ID or Username already exists.');
                    document.getElementById('createEmployeeForm').reset(); 
                }
            }
            console.error('Error creating employee member:', error);
            // Handle errors here if needed
        }
    });
});
// Attach a click event listener to a parent element (e.g., a container element that holds the buttons)
$(document).on('click', 'button.edit-btn-emp', function () {
    // Populate the Edit Modal with the data to be edited
    const empId = $(this).closest('tr').find('.emp_id').text();
    const assignedTo = $(this).closest('tr').find('.emp_group').text();


    // Set the values in the Edit Modal form fields
    $('#edit_empID').val(empId);
    $('#edit_empGroup').val(assignedTo);

    // Show the Edit Modal
    $('#editEmpModal').modal('show');
});

// Handle form submission for the Edit Modal
$('#editEmployeeForm').submit(function (event) {
    event.preventDefault();

    // Collect the edited form data
    const editedData = {
        empId: $('#edit_empID').val(),
        assignedTo: $('#edit_empGroup').val(),
    };

    // Send the edited data to the server using AJAX
    $.ajax({
        type: 'POST',
        url: '/edit-emp-group', // Replace with your server endpoint for editing a task
        data: editedData,
        success: function (response) {
            // Handle success, e.g., close the modal and refresh the table
            alert("Group edited successfully");
            $('#editEmpModal').modal('hide');
            populateEmployeeTable(); // Refresh the table with updated data
        },
        error: function (error) {
            console.error('Error editing group:', error);
            // Handle errors here if needed
        },
    });
});
// Event delegation: Listen for "Delete" button clicks
document.getElementById('emp_table').addEventListener('click', function (event) {
    if (event.target.classList.contains('delete-btn-emp')) {
        const row = event.target.closest('tr');
        const empId = row.querySelector('.emp_id').textContent;

        // Show the confirmation modal when the "Delete" button is clicked
        $('#confirmDeleteModal1').modal('show');

        // Attach a click event to the "Delete" button in the modal
        $('#confirmDeleteButton1').off('click').on('click', function () {
            // Call a function to delete the staff member
            deleteEmployeeMember(empId);
        });
    }
});

// Function to delete the staff member
function deleteEmployeeMember(empId) {

    // Send an AJAX request to delete the staff member
    $.ajax({
        type: 'POST',
        url: '/delete-employee',
        data: { empId },
        success: function (response) {
            if (response.success) {
                // Close the confirmation modal
                $('#confirmDeleteModal1').modal('hide');

                populateEmployeeTable();
            } else {
                // Handle errors here
                alert('Error deleting the employee member.');
            }
        },
        error: function (error) {
            console.error('Error deleting employee member:', error);
            // Handle errors here if needed
        }
    });
}
// Function to filter the table rows based on search input
function filterTableStaff() {
    const searchInput = document.getElementById('staff_searchInput');
    const searchTerm = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll('#staff_table tbody tr');

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
function filterTableEmployee() {
    const searchInput = document.getElementById('emp_searchInput');
    const searchTerm = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll('#emp_table tbody tr');

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
    populateStaffTable();
    populateEmployeeTable();
});
// Attach event listener to search input for live filtering
const searchInputStaff = document.getElementById('staff_searchInput');
searchInputStaff.addEventListener('input', filterTableStaff);
const searchInputEmployee = document.getElementById('emp_searchInput');
searchInputEmployee.addEventListener('input', filterTableEmployee);

$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
});


function logoutAdmin() {
    shouldDisplayAlert = false;
    fetch('/logout-admin', {
        method: 'GET',
        credentials: 'same-origin' // Include cookies in the request
    })
    .then((response) => {
        if (response.redirected) {
            // If the server redirected to the login page, redirect the user
            window.location.href = '/adminlogin';
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
