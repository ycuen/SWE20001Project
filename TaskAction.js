// Function to check if the session has expired and show a modal popup
function checkSessionStatus() {
    fetch('/checkSessionStatus', {
        method: 'GET',
        credentials: 'same-origin'
    })
    .then((response) => response.json())
    .then((data) => {
        if (!data.isAuthenticated) {
 
        } 
    })
    .catch((error) => {
        console.error('Error checking session status:', error);
    });
}
// Check the session status every 10 seconds (adjust as needed)
setInterval(checkSessionStatus, 10000); // 10 seconds in milliseconds

// function showModalPopup() {
//     const modal = document.getElementById('exampleModal');
//     $(modal).modal('show');
// }

// // Trigger the initial session check when the page loads
// document.addEventListener('DOMContentLoaded', () => {
//     checkSessionStatus();
// });
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

                newRow.innerHTML = `
                <td>${row.TaskId}</td>
                <td>${row.Task_Name}</td>
                <td>${row.Task_Description}</td>
                <td>${row.Assigned_To}</td>
                <td>${startTime.toLocaleString()}</td>
                <td>${dueDate.toLocaleString()}</td>
                <td>
                    <!-- Add CRUD buttons here -->
                    <button type="button" class="btn btn-outline-primary">Edit</button>
                    <button type="button" class="btn btn-outline-danger">Delete</button>
                    <button type="button" class="btn btn-outline-success">Complete</button>
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
// Call the function to populate the table when the page loads
$(document).ready(function () {
    populateAdminTable();
});
