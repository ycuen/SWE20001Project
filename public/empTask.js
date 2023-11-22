function populateEmployeeTable() {
   
    $.ajax({
        type: 'GET',
        url: `/fetch-emp-tasks`, 
        success: function (data) {
          
            const empTable = document.getElementById('emp_Table');
            const tbody = empTable.querySelector('tbody');
            tbody.innerHTML = '';

            data.forEach(function (row) {
                const newRow = document.createElement('tr');
               

                newRow.innerHTML = `
                <td class="task-id">${row.task_id}</td>
                <td class="task-name">${row.task_name}</td>
                <td class="task-description">${row.task_description}</td>
                <td class="created-time">${formatDate(row.created_time)}</td>
                <td class="due-date">${formatDate(row.due_date)}</td>
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
                    <button type="button" class="btn btn-outline-success complete-btn" ${row.is_complete === 0 || row.is_complete === 2 || row.is_complete === 4 ? 'disabled' : ''}>Complete</button>
                    <button type="button" class="btn btn-outline-info info-btn-emp">Comment</button>
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
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
    return formattedDate;
}



function getEmpUsername() {
    fetch('/getEmpUsername', {
        method: 'GET',
        credentials: 'include' 
    })
    .then(response => response.json())
    .then(data => {
        const empUsername = data.emp_username;
        if (empUsername) {
       
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

        
        $('#confirmAcceptModalEmp').modal('show');

        $('#confirmAcceptButtonStaff').off('click').on('click', function () {
         
            acceptTaskEmp(taskId);
        });
    }
});
function acceptTaskEmp(taskId)
{
 
 $.ajax({
    type: 'POST',
    url: '/accept-task',
    data: { taskId },
    success: function (response) {
        if (response.success) {
            alert("Task is accepted successfull.");
            
            $('#confirmAcceptModalEmp').modal('hide');
            populateEmployeeTable();
        } else {
            
            alert('Error accepting the task.');
        }
    },
    error: function (error) {
        console.error('Error accepting task:', error);
       
    }
});
}
document.getElementById('emp_Table').addEventListener('click', function (event) {
    if (event.target.classList.contains('complete-btn')) {
        const row = event.target.closest('tr');
        const taskId = row.querySelector('.task-id').textContent;

        $('#confirmCompleteModalEmp').modal('show');

        
        $('#confirmCompleteButtonEmp').off('click').on('click', function () {
        
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
               
                $('#confirmCompleteModalEmp').modal('hide');
                populateEmployeeTable();
            } else {
                
                alert('Error completing the task.');
            }
        },
        error: function (error) {
            console.error('Error completing task:', error);
           
        }
    });
  
}
$(document).on('click', '.info-btn-emp', function () {
    const taskId = $(this).closest('tr').find('.task-id').text();
   DisplayReviewHistory(taskId);
   $('#reviewModalEmp').modal('show');
});

function DisplayReviewHistory(taskId) {
 
    $.ajax({
        type: 'GET',
        url: `/get-review-emp/${taskId}`,
        success: function (reviews) {
           
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

           
            $('#reviewModalEmp').modal('show');
        },
        error: function (error) {
            console.error('Error fetching review history:', error);
         
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

$(document).ready(function () {
    populateEmployeeTable();

});
const searchInputEmp = document.getElementById('searchInput_emp');
searchInputEmp.addEventListener('input', filterTableEmp);
setInterval(populateEmployeeTable, 5000);

function logoutEmp() {
    shouldDisplayAlert = false;
    fetch('/logout-emp', {
        method: 'GET',
        credentials: 'same-origin' 
    })
    .then((response) => {
        if (response.redirected) {
            
            window.location.href = '/elogin';
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
