document.addEventListener('DOMContentLoaded', () => {
  let employees = [];
  let deletedEmployees = [];

  const form = document.getElementById('employee-form');
  const tableBody = document.querySelector('#employee-table tbody');
  const trashTable = document.getElementById('trash-table');
  const trashBody = trashTable.querySelector('tbody');
  const nameInput = document.getElementById('name');
  const roleInput = document.getElementById('role');
  const statusInput = document.getElementById('status');
  const editIndexInput = document.getElementById('editIndex');
  const saveBtn = document.getElementById('saveBtn');

  let trashVisible = false;

 function openModal(isEdit = false) {
  if (!isEdit) form.reset();
  editIndexInput.value = -1;
  saveBtn.textContent = 'Save';
  document.getElementById('employeeModal').style.display = 'block';
}


  function closeModal() {
    document.getElementById('employeeModal').style.display = 'none';
  }

  window.onclick = function (e) {
    const modal = document.getElementById('employeeModal');
    if (e.target === modal) {
      closeModal();
    }
  };

  function renderTable() {
    tableBody.innerHTML = '';
    for (let i = 0; i < employees.length; i++) {
      const emp = employees[i];
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${emp.name}</td>
        <td>${emp.role}</td>
        <td>${emp.status}</td>
        <td>
          <button class="btn btn-secondary" onclick="editEmployee(${i})"> Edit</button>
          <button class="btn btn-danger" onclick="deleteEmployee(${i})">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    }
  }

  function renderTrash() {
    trashBody.innerHTML = '';
    for (let i = 0; i < deletedEmployees.length; i++) {
      const emp = deletedEmployees[i];
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${emp.name}</td>
        <td>${emp.role}</td>
        <td>${emp.status}</td>
        <td>
          <button class="btn btn-secondary" onclick="restoreEmployee(${i})">Restore</button>
          <button class="btn btn-danger" onclick="permanentlyDelete(${i})">Delete Forever</button>
        </td>
      `;
      trashBody.appendChild(row);
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    const role = roleInput.value.trim();
    const status = statusInput.value;
    const editIndex = Number(editIndexInput.value);

    if (editIndex === -1) {
      employees.push({ name, role, status });
    } else {
      employees[editIndex] = { name, role, status };
    }

    closeModal();
    renderTable();
    if (trashVisible) renderTrash();
  });

  function deleteEmployee(index) {
    const deleted = employees.splice(index, 1)[0];
    deletedEmployees.push(deleted);
    renderTable();
    if (trashVisible) renderTrash();
  }

 function editEmployee(index) {
  openModal(true); // اجعلها تعديل
  const emp = employees[index];
  nameInput.value = emp.name;
  roleInput.value = emp.role;
  statusInput.value = emp.status;
  editIndexInput.value = index;
  saveBtn.textContent = 'Update';
}


  function restoreEmployee(index) {
    const restored = deletedEmployees.splice(index, 1)[0];
    employees.push(restored);
    renderTable();
    renderTrash();
  }

  function permanentlyDelete(index) {
    if (confirm('Are you sure you want to permanently delete this employee? This action cannot be undone.')) {
      deletedEmployees.splice(index, 1);
      renderTrash();
    }
  }

  function toggleTrash() {
    trashVisible = !trashVisible;
    trashTable.style.display = trashVisible ? 'table' : 'none';
    if (trashVisible) renderTrash();
  }

  // expose functions to window so HTML onclick can access
  window.editEmployee = editEmployee;
  window.deleteEmployee = deleteEmployee;
  window.restoreEmployee = restoreEmployee;
  window.permanentlyDelete = permanentlyDelete;
  window.toggleTrash = toggleTrash;
  window.openModal = openModal;
  window.closeModal = closeModal;

  renderTable();
  renderTrash();
  trashTable.style.display = 'none';
});
