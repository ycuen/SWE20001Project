let shouldDisplayAlert = true;

function populateStaffTable() {
 
    $.ajax({
        type: 'GET',
        url: `/fetch-staff-tasks`, 
        success: function (data) {
  
            const staffTable = document.getElementById('staffTable');
            const tbody = staffTable.querySelector('tbody');
            tbody.innerHTML = '';

            
            data.forEach(function (row) {
                const newRow = document.createElement('tr');
               

                newRow.innerHTML = `
                <td class="task-id">${row.task_id}</td>
                <td class="task-name">${row.task_name}</td>
                <td class="task-description">${row.task_description}</td>
                <td class="created-time">${formatDate(row.created_time)}</td>
                <td class="due-date">${formatDate(row.due_date)}</td>             
                <td class="assign-to">${row.assign_to}</td>
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
                    <button type="button" class="btn btn-outline-primary edit-btn" data-toggle="modal" data-target="#editModal"" ${row.is_complete === 4 ? 'disabled' : ''}>Edit</button>
                    <button type="button" class="btn btn-outline-danger reject-btn-task" ${row.is_complete === 2 ? '' : 'disabled'}>Reject</button>  
                    <button type="button" class="btn btn-outline-success complete-btn-task" ${row.is_complete === 2 ? '' : 'disabled'}>Complete</button>
                    <button type="button" class="btn btn-outline-info info-btn-task" ${row.is_complete === 4 ? 'disabled' : ''}>Comment</button>
                    <button type="button" class="btn btn-outline-danger delete-btn-task">Delete</button>
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
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
    return formattedDate;
}

function populateEmployeeDropdown() {
    $.ajax({
        type: 'GET',
        url: '/fetch-employees', 
        success: function (employees) {
            const assignedToDropdown = document.getElementById('assignedTo');
            assignedToDropdown.innerHTML = '';

            employees.forEach(function (employee) {
                const option = document.createElement('option');
                option.value = employee.emp_id;
                option.textContent = employee.emp_username;
                assignedToDropdown.appendChild(option);
            });
        },
        error: function (error) {
            console.error('Error fetching employees:', error);
            
        }
    });
}
function getStaffUsername() {
    fetch('/getStaffUsername', {
        method: 'GET',
        credentials: 'include' 
    })
    .then(response => response.json())
    .then(data => {
        const staffUsername = data.username;
        if (staffUsername) {
            
            const welcomeMessage = document.getElementById('welcomeStaff');
            welcomeMessage.textContent = 'Welcome back ' + staffUsername;
        }
    })
    .catch(error => {
        console.error('Error fetching admin username:', error);
    });
}
window.addEventListener('load', getStaffUsername);




$('#assignModal').on('show.bs.modal', function (event) {
    
    populateEmployeeDropdown();
});


$('#assignForm').submit(function (event) {
    event.preventDefault();

   
    const formData = {
        taskId: $('#taskId').val(),
        taskName: $('#taskName').val(),
        taskDescription: $('#taskDescription').val(),
        createdtime: $('#createdtime').val(),
        dueDate: $('#dueDate').val(),
        assignedTo: $('#assignedTo').val(),
    };

 
    $.ajax({
        type: 'POST', 
        url: '/create-task',
        data: formData,
        success: function (response) {
          
            $('#assignModal').modal('hide');
            alert('Task created successfully');
            populateStaffTable();

            $('#assignForm')[0].reset();
        },
        error: function (error) {
            console.error('Error creating task:', error);
            
            if (error.responseJSON && error.responseJSON.error === 'Task ID already exists') {
                
                alert('Task ID already exists. Please choose a different ID.');
                $('#assignForm')[0].reset();
            } else {
                
            }
        }
    });
});


$('.assign-button').click(function () {
    $('#assignModal').modal('show');
});

function populateEmployeeDropdown_Edit() {
    $.ajax({
        type: 'GET',
        url: '/fetch-employees_edit', 
        success: function (employees) {
            const assignedToDropdown = document.getElementById('assignedTo_edit');
            assignedToDropdown.innerHTML = '';

            employees.forEach(function (employee) {
                const option = document.createElement('option');
                option.value = employee.emp_id;
                option.textContent = employee.emp_username;
                assignedToDropdown.appendChild(option);
            });
        },
        error: function (error) {
            console.error('Error fetching employees:', error);
           
        }
    });
}


$('#editModal').on('show.bs.modal', function (event) {
    
    populateEmployeeDropdown_Edit();
});


$(document).on('click', 'button.edit-btn', function () {

    const taskId = $(this).closest('tr').find('.task-id').text();
    const taskName = $(this).closest('tr').find('.task-name').text();
    const taskDescription = $(this).closest('tr').find('.task-description').text();
    const createTime = $(this).closest('tr').find('.created-time').text();
    const dueDate = $(this).closest('tr').find('.due-date').text();
    const assignedTo = $(this).closest('tr').find('.assign-to').text();


  
    $('#editTaskId').val(taskId);
    $('#editTaskName').val(taskName);
    $('#editTaskDescription').val(taskDescription);
    $('#editCreateTime').val(createTime);
    $('#editDueDate').val(dueDate);
    $('#assignedTo_edit').val(assignedTo);
    
    $('#editModal').modal('show');
});


$('#editForm').submit(function (event) {
    event.preventDefault();

   
    const editedData = {
        taskId: $('#editTaskId').val(),
        taskName: $('#editTaskName').val(),
        taskDescription: $('#editTaskDescription').val(),
        createTime: $('#editCreateTime').val(),
        dueDate: $('#editDueDate').val(),
        assignedTo: $('#assignedTo_edit').val(),
    };
        
        const editedDataString = JSON.stringify(editedData);

    
    $.ajax({
        type: 'POST',
        url: '/edit-task', 
        data: editedData,
        success: function (response) {
         
            alert("Task edited successfully");
            $('#editModal').modal('hide');
            populateStaffTable(); 
        },
        error: function (error) {
            console.error('Error editing task:', error);
           
        },
    });
});

document.getElementById('staffTable').addEventListener('click', function (event) {
    if (event.target.classList.contains('delete-btn-task')) {
        const row = event.target.closest('tr');
        const taskId = row.querySelector('.task-id').textContent;

  
        $('#confirmDeleteModalStaff').modal('show');

     
        $('#confirmDeleteButtonStaff').off('click').on('click', function () {
     
            deleteTaskStaff(taskId);
        });
    }
});


function deleteTaskStaff(taskId) {

    
    $.ajax({
        type: 'POST',
        url: '/delete-staff-task',
        data: { taskId },
        success: function (response) {
            if (response.success) {
                alert("Delete task successfull.");
                
                $('#confirmDeleteModalStaff').modal('hide');
                populateStaffTable();
            } else {
                
                alert('Error deleting the task.');
            }
        },
        error: function (error) {
            console.error('Error deleting task:', error);
           
        }
    });
}

document.getElementById('staffTable').addEventListener('click', function (event) {
    if (event.target.classList.contains('complete-btn-task')) {
        const row = event.target.closest('tr');
        const taskId = row.querySelector('.task-id').textContent;

      
        $('#confirmCompleteModalStaff').modal('show');

     
        $('#confirmCompleteButtonStaff').off('click').on('click', function () {
            
            completeTaskStaff(taskId);
        });
    }
});
function completeTaskStaff(taskId)
{

 $.ajax({
    type: 'POST',
    url: '/complete-task',
    data: { taskId },
    success: function (response) {
        if (response.success) {
            alert("Task is complete successfull.");
            
            $('#confirmCompleteModalStaff').modal('hide');
            populateStaffTable();
        } else {
          
            alert('Error completing the task.');
        }
    },
    error: function (error) {
        console.error('Error completing task:', error);
        
    }
});
}

document.getElementById('staffTable').addEventListener('click', function (event) {
    if (event.target.classList.contains('reject-btn-task')) {
        const row = event.target.closest('tr');
        const taskId = row.querySelector('.task-id').textContent;

      
        $('#confirmRejectModalStaff').modal('show');

       
        $('#confirmRejectButtonStaff').off('click').on('click', function () {
            
            rejectTaskStaff(taskId);
        });
    }
});
function rejectTaskStaff(taskId)
{

 $.ajax({
    type: 'POST',
    url: '/reject-task',
    data: { taskId },
    success: function (response) {
        if (response.success) {
            alert("Task is rejected successfull.");
       
            $('#confirmRejectModalStaff').modal('hide');
            populateStaffTable();
        } else {
           
            alert('Error rejecting the task.');
        }
    },
    error: function (error) {
        console.error('Error rejecting task:', error);

    }
});
}

$(document).on('click', '.info-btn-task', function () {
    const taskId = $(this).closest('tr').find('.task-id').text();
    fetchAndDisplayReviewHistory(taskId);

   
    $('#reviewModalStaff .modal-content').data('task-id', taskId); 

    
});


$('#submitReviewStaff').click(function (event) {
    const taskId = $('#reviewModalStaff .modal-content').data('task-id'); 
    const reviewText = $('#reviewText').val();

   
    $.ajax({
        type: 'POST',
        url: `/submit-review/${taskId}`, 
        data: { reviewText: reviewText },
        success: function (response) {
           
            $('#reviewText').val('');
            alert('Insert comment successfull.');
           
            fetchAndDisplayReviewHistory(taskId);

           

        },
        error: function (error) {
            console.error('Error submitting review:', error);
           
        },
    });

  
    event.preventDefault();
});

function fetchAndDisplayReviewHistory(taskId) {
    
    $.ajax({
        type: 'GET',
        url: `/get-review-history/${taskId}`, 
        success: function (reviews) {
           
            const reviewList = $('#reviewListStaff');
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

          
            $('#reviewModalStaff').modal('show');
        },
        error: function (error) {
            console.error('Error fetching review history:', error);
           
        },
    });
}

function filterTableStaff() {
    const searchInput = document.getElementById('searchInput_staff');
    const searchTerm = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll('#staffTable tbody tr');

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
    populateStaffTable();

});


const searchInput = document.getElementById('searchInput_staff');
searchInput.addEventListener('input', filterTableStaff);

function logout() {
    shouldDisplayAlert = false;
    fetch('/logout-staff', {
        method: 'GET',
        credentials: 'same-origin' 
    })
    .then((response) => {
        if (response.redirected) {
          
            window.location.href = response.url;
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
});
setInterval(populateStaffTable, 5000); //  5 seconds


function refreshPage() {
    location.reload(); 
}


const refreshInterval = 30 * 60 * 1000;


setInterval(refreshPage, refreshInterval);
