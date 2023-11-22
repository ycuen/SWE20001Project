let sortAscending = true;
function populateStaffTable() {
    
    $.ajax({
        type: 'GET',
        url: '/fetch-admin_staff-data',
        success: function (data) {

           
            const staff_table = document.getElementById('staff_table');
            const tbody = staff_table.querySelector('tbody');
            tbody.innerHTML = '';

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
            
        }
    });
}
function getAdminUsername() {
    fetch('/getAdminUsername', {
        method: 'GET',
        credentials: 'include' 
    })
    .then(response => response.json())
    .then(data => {
        const adminUsername = data.admin_username;
        if (adminUsername) {
            
            const welcomeMessage = document.getElementById('welcomeMessage');
            welcomeMessage.textContent = 'Welcome back ' + adminUsername;
        }
    })
    .catch(error => {
        console.error('Error fetching admin username:', error);
    });
}
window.addEventListener('load', getAdminUsername);

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

$('#createStaffForm').on('submit', function (event) {
    event.preventDefault(); 

    const staffId = $('#staffID').val();
    const staffName = $('#staffName').val();
    const staffUsername = $('#staffUsername').val();
    const staffPassword = $('#staffPassword').val();
    const staffGroup = $('#staffGroup').val();

    
    $.ajax({
        type: 'POST',
        url: '/check-group',
        data: { staffGroup },
        success: function (response) {
            if (response.isAssigned) {
               
                alert('This group is already assigned to another staff.');
                document.getElementById('createStaffForm').reset(); 
            } else {
               
                createStaffMember(staffId, staffName, staffUsername, staffPassword, staffGroup);
            }
        },
        error: function (error) {
            console.error('Error checking group:', error);
            document.getElementById('createStaffForm').reset(); 
           
        }
    });
});


function createStaffMember(staffId, staffName, staffUsername, staffPassword, staffGroup) {
  
    $.ajax({
        type: 'POST',
        url: '/create-staff',
        data: { staffId, staffName, staffUsername, staffPassword, staffGroup },
        success: function (response) {
            if (response.success) {
             
                $('#createStaffModal').modal('hide');
                alert('Staff created successfully !');
               
                document.getElementById('createStaffForm').reset();   
              
                populateStaffTable();
            } else {
                
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
           
           
        }
    });
}

$(document).on('click', 'button.edit-btn', function () {
 
    const staffId = $(this).closest('tr').find('.staff_id').text();
    const assignedTo = $(this).closest('tr').find('.staff_group').text();



    $('#edit_staffID').val(staffId);
    $('#edit_staffGroup').val(assignedTo);


    $('#editStaffModal').modal('show');
});


$('#editStaffForm').submit(function (event) {
    event.preventDefault();

    const editedData = {
        staffId: $('#edit_staffID').val(),
        assignedTo: $('#edit_staffGroup').val(),
    };

   
    $.ajax({
        type: 'POST',
        url: '/edit-staff-group', 
        data: editedData,
        success: function (response) {
          
            alert("Group edited successfully");
            $('#editStaffModal').modal('hide');
            populateStaffTable(); 
        },
        error: function (error) {
            console.error('Error editing group:', error);
           
        },
    });
});

document.getElementById('staff_table').addEventListener('click', function (event) {
    if (event.target.classList.contains('delete-btn')) {
   
        const row = event.target.closest('tr');
        const staffId = row.querySelector('.staff_id').textContent;

        
        $('#confirmDeleteModal').modal('show');

        
        $('#confirmDeleteButton').off('click').on('click', function () {
           
            deleteStaffMember(staffId);
        });
    }
});


function deleteStaffMember(staffId) {

    $.ajax({
        type: 'POST',
        url: '/delete-staff',
        data: { staffId },
        success: function (response) {
            if (response.success) {
               
                $('#confirmDeleteModal').modal('hide');

                populateStaffTable();
            } else {
               
                alert('Error deleting the staff member.');
            }
        },
        error: function (error) {
            console.error('Error deleting staff member:', error);
           
        }
    });
}


function populateEmployeeTable() {
  
    $.ajax({
        type: 'GET',
        url: '/fetch-admin_emp-data', 
        success: function (data) {

            const staff_table = document.getElementById('emp_table');
            const tbody = staff_table.querySelector('tbody');
            tbody.innerHTML = '';

           
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
        
        }
    });
}
$(document).ready(function () {
   
    $('#staffGroup').on('change', function () {
        const selectedGroup = $(this).val();

        $.ajax({
            type: 'GET',
            url: `/fetch-group-table/${selectedGroup}`, 
            success: function (data) {
               
            },
            error: function (error) {
                console.error('Error fetching group data:', error);
         
            }
        });
    });
});

$('#createEmployeeForm').on('submit', function (event) {
    event.preventDefault();
    const empId = $('#emp_id').val();
    const empName = $('#emp_name').val();
    const empUsername = $('#emp_username').val();
    const empPassword = $('#emp_password').val();
    const empGroup = $('#emp_group').val();


    $.ajax({
        type: 'POST',
        url: '/create-employee',
        data: { empId, empName, empUsername, empPassword, empGroup},
        success: function (response) {
            if (response.success) {
               
                $('#createEmployeeModal').modal('hide');
                alert('Employee created successfully !');
    
                document.getElementById('createEmployeeForm').reset();   
               
                populateEmployeeTable();
            } else {
               
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
        
        }
    });
});

$(document).on('click', 'button.edit-btn-emp', function () {
   
    const empId = $(this).closest('tr').find('.emp_id').text();
    const assignedTo = $(this).closest('tr').find('.emp_group').text();


 
    $('#edit_empID').val(empId);
    $('#edit_empGroup').val(assignedTo);

   
    $('#editEmpModal').modal('show');
});


$('#editEmployeeForm').submit(function (event) {
    event.preventDefault();

   
    const editedData = {
        empId: $('#edit_empID').val(),
        assignedTo: $('#edit_empGroup').val(),
    };

    $.ajax({
        type: 'POST',
        url: '/edit-emp-group', 
        data: editedData,
        success: function (response) {
         
            alert("Group edited successfully");
            $('#editEmpModal').modal('hide');
            populateEmployeeTable();
        },
        error: function (error) {
            console.error('Error editing group:', error);
            
        },
    });
});

document.getElementById('emp_table').addEventListener('click', function (event) {
    if (event.target.classList.contains('delete-btn-emp')) {
        const row = event.target.closest('tr');
        const empId = row.querySelector('.emp_id').textContent;

  
        $('#confirmDeleteModal1').modal('show');


        $('#confirmDeleteButton1').off('click').on('click', function () {
  
            deleteEmployeeMember(empId);
        });
    }
});

function deleteEmployeeMember(empId) {

 
    $.ajax({
        type: 'POST',
        url: '/delete-employee',
        data: { empId },
        success: function (response) {
            if (response.success) {
               
                $('#confirmDeleteModal1').modal('hide');

                populateEmployeeTable();
            } else {
                
                alert('Error deleting the employee member.');
            }
        },
        error: function (error) {
            console.error('Error deleting employee member:', error);
            
        }
    });
}

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
        credentials: 'same-origin' 
    })
    .then((response) => {
        if (response.redirected) {
            
            window.location.href = '/adminlogin';
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function refreshPage() {
    location.reload(); 
}


const refreshInterval = 30 * 60 * 1000;


setInterval(refreshPage, refreshInterval);
