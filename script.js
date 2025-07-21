// بيانات أولية
const employees = [
  { name: "Ahmed Ali", job: "Software Engineer", dept: "IT", salary: 4000, bonus: 400, status: "Active" },  // bonus مخزن كناتج قيمة وليس نسبة
  { name: "Sarah Mohammed", job: "HR Manager", dept: "Human Resources", salary: 5200, bonus: 780, status: "Active" },
  { name: "Faisal Omar", job: "Accountant", dept: "Finance", salary: 3800, bonus: 190, status: "On Leave" },
  { name: "Leila Hassan", job: "Marketing Specialist", dept: "Marketing", salary: 3600, bonus: 252, status: "Active" }
];
const deletedEmployees = [];

const tbody = document.querySelector("#employeeTable tbody");
const deletedTbody = document.querySelector("#deletedEmployeeTable tbody");
const totalPayrollCell = document.getElementById("totalPayrollCell");

const filterToggleBtn = document.getElementById("filterToggleBtn");
const filterDropdown = document.getElementById("filterDropdown");
const applyFiltersBtn = document.getElementById("applyFiltersBtn");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");

let editIndex = null;  // تتبع حالة التعديل
let currentBonusEditIndex = null; // تتبع الموظف لتعديل البونص

// --- عرض بيانات الموظفين كاملة (غير مفلترة)
function renderEmployees() {
  tbody.innerHTML = "";
  let totalPayroll = 0;

  employees.forEach((emp, index) => {
    totalPayroll += emp.salary;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${emp.name}</td>
      <td>${emp.job}</td>
      <td>${emp.dept}</td>
      <td>$${emp.salary.toLocaleString()}</td>
      <td>${emp.status}</td>
      <td>$${emp.bonus ? emp.bonus.toLocaleString() : '0'}</td>
      <td>
        <button class="btn edit-btn" data-index="${index}">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn delete-btn" data-index="${index}">
          <i class="fas fa-trash-alt"></i>
        </button>
        <button class="btn bonus-btn" data-index="${index}" style="background:#007bff; color: white; margin-left: 5px;">
          <i class="fas fa-dollar-sign"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  totalPayrollCell.textContent = `$${totalPayroll.toLocaleString()} R`;
}

// --- عرض بيانات الموظفين المحذوفين
function renderDeletedEmployees() {
  deletedTbody.innerHTML = "";
  deletedEmployees.forEach((emp, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${emp.name}</td>
      <td>${emp.job}</td>
      <td>${emp.dept}</td>
      <td>$${emp.salary.toLocaleString()}</td>
      <td>${emp.status}</td>
      <td>$${emp.bonus ? emp.bonus.toLocaleString() : '0'}</td>
      <td>
        <button class="btn restore-btn" data-index="${index}" style="color:green;">
          <i class="fas fa-undo"></i>
        </button>
        <button class="btn perm-delete-btn" data-index="${index}" style="color:red;">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    deletedTbody.appendChild(tr);
  });
}

// --- فتح مودال إضافة/تعديل الموظف
function openModal() {
  document.getElementById("employeeModal").style.display = "block";
  if(editIndex === null) {
    employeeForm.reset();
  }
}
function closeModal() {
  document.getElementById("employeeModal").style.display = "none";
}

// --- فتح مودال البونص
function openBonusModal() {
  document.getElementById("bonusModal").style.display = "block";
}
function closeBonusModal() {
  document.getElementById("bonusModal").style.display = "none";
}

// --- التعامل مع الفورم لإضافة أو تعديل موظف
const employeeForm = document.querySelector(".employee-form");
employeeForm.addEventListener("submit", function(e){
  e.preventDefault();

  const name = document.getElementById("employeeName").value.trim();
  const job = document.getElementById("employeeJob").value.trim();
  const dept = document.getElementById("employeeDept").value.trim();
  const salary = Number(document.getElementById("employeeSalary").value);
  const status = document.getElementById("employeeStatus").value;

  if (!name || !job || !dept || isNaN(salary) || !status) {
    alert("Please fill all fields correctly!");
    return;
  }

  if(editIndex === null){
    // إضافة موظف جديد مع بونص 0
    employees.push({name, job, dept, salary, status, bonus: 0});
  } else {
    // تعديل موظف موجود مع بونص سابق (إذا موجود)
    employees[editIndex] = {
      name,
      job,
      dept,
      salary,
      status,
      bonus: employees[editIndex].bonus ?? 0
    };
    editIndex = null;
  }

  renderEmployees();
  closeModal();
  employeeForm.reset();
});

// --- التعامل مع أزرار تعديل، حذف، بونص في جدول الموظفين
tbody.addEventListener("click", function(e){
  const btn = e.target.closest("button");
  if(!btn) return;

  const index = Number(btn.dataset.index);

  if(btn.classList.contains("edit-btn")){
    // تعبئة الفورم بالبيانات وفتح المودال
    const emp = employees[index];
    document.getElementById("employeeName").value = emp.name;
    document.getElementById("employeeJob").value = emp.job;
    document.getElementById("employeeDept").value = emp.dept;
    document.getElementById("employeeSalary").value = emp.salary;
    document.getElementById("employeeStatus").value = emp.status;
    editIndex = index;
    openModal();
  }
  else if(btn.classList.contains("delete-btn")){
    // حذف (نقل إلى المحذوفات)
    const emp = employees.splice(index,1)[0];
    deletedEmployees.push(emp);
    renderEmployees();
    renderDeletedEmployees();
  }
  else if(btn.classList.contains("bonus-btn")){
    // فتح مودال البونص وتعبئة القيمة الحالية كنسبة مع الحساب العكسي
    currentBonusEditIndex = index;
    const emp = employees[index];
    const salary = emp.salary;
    const bonusValue = emp.bonus ?? 0;
    // حساب نسبة البونص (عكس الحساب)
    const bonusPercent = salary === 0 ? 0 : (bonusValue / salary) * 100;
    document.getElementById("bonusInput").value = bonusPercent.toFixed(2);
    openBonusModal();
  }
});

// --- التعامل مع أزرار الاستعادة والحذف الدائم في جدول المحذوفات
deletedTbody.addEventListener("click", function(e){
  const btn = e.target.closest("button");
  if(!btn) return;

  const index = Number(btn.dataset.index);

  if(btn.classList.contains("restore-btn")){
    // استعادة موظف
    const emp = deletedEmployees.splice(index,1)[0];
    employees.push(emp);
    renderEmployees();
    renderDeletedEmployees();
  } else if(btn.classList.contains("perm-delete-btn")){
    // حذف نهائي
    deletedEmployees.splice(index,1);
    renderDeletedEmployees();
  }
});

// --- حفظ البونص الجديد من مودال البونص (كمئوية تُدخل ثم تُحسب وتحفظ كقيمة فعلية)
function saveBonus(){
  const bonusPercent = Number(document.getElementById("bonusInput").value);
  if(isNaN(bonusPercent) || bonusPercent < 0 || bonusPercent > 100){
    alert("Please enter a valid bonus percentage (0-100).");
    return;
  }
  if(currentBonusEditIndex === null){
    alert("No employee selected for bonus.");
    return;
  }
  // حساب قيمة البونص = الراتب × النسبة ÷ 100
  const salary = employees[currentBonusEditIndex].salary;
  const bonusValue = (salary * bonusPercent) / 100;

  employees[currentBonusEditIndex].bonus = bonusValue;
  currentBonusEditIndex = null;
  renderEmployees();
  closeBonusModal();
}

// --- دالة عرض الموظفين بعد الفلترة (مع دعم أزرار الوظائف)
function renderEmployeesFiltered(filteredEmployees) {
  tbody.innerHTML = "";
  let totalPayroll = 0;

  filteredEmployees.forEach((emp) => {
    totalPayroll += emp.salary;

    // الحصول على index الموظف الأصلي في مصفوفة employees حسب الاسم
    const index = employees.findIndex(e => e.name === emp.name);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${emp.name}</td>
      <td>${emp.job}</td>
      <td>${emp.dept}</td>
      <td>$${emp.salary.toLocaleString()}</td>
      <td>${emp.status}</td>
      <td>$${emp.bonus ? emp.bonus.toLocaleString() : '0'}</td>
      <td>
        <button class="btn edit-btn" data-index="${index}">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn delete-btn" data-index="${index}">
          <i class="fas fa-trash-alt"></i>
        </button>
        <button class="btn bonus-btn" data-index="${index}" style="background:#007bff; color: white; margin-left: 5px;">
          <i class="fas fa-dollar-sign"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  totalPayrollCell.textContent = `$${totalPayroll.toLocaleString()} R`;
}

// --- تطبيق الفلاتر على بيانات الموظفين
function applyFilters() {
  // قراءة قيم الفلاتر
  const searchName = document.getElementById("searchName").value.trim().toLowerCase();
  const filterRole = document.getElementById("filterRole").value.trim().toLowerCase();
  const minSalary = Number(document.getElementById("minSalary").value);
  const maxSalary = Number(document.getElementById("maxSalary").value);
  const minBonusPercent = Number(document.getElementById("minBonus").value);
  const maxBonusPercent = Number(document.getElementById("maxBonus").value);
  const filterStatus = document.getElementById("filterStatus").value;

  // فلترة الموظفين
  const filtered = employees.filter(emp => {
    // اسم الموظف
    if (searchName && !emp.name.toLowerCase().includes(searchName)) return false;

    // المسمى الوظيفي
    if (filterRole && !emp.job.toLowerCase().includes(filterRole)) return false;

    // نطاق الراتب
    if (!isNaN(minSalary) && minSalary > 0 && emp.salary < minSalary) return false;
    if (!isNaN(maxSalary) && maxSalary > 0 && emp.salary > maxSalary) return false;

    // حساب نسبة البونص (المخزن كقيمة فعلية / الراتب * 100)
    let bonusPercent = 0;
    if(emp.salary > 0){
      bonusPercent = (emp.bonus / emp.salary) * 100;
    }
    // نطاق البونص
    if (!isNaN(minBonusPercent) && minBonusPercent > 0 && bonusPercent < minBonusPercent) return false;
    if (!isNaN(maxBonusPercent) && maxBonusPercent > 0 && bonusPercent > maxBonusPercent) return false;

    // الحالة
    if (filterStatus && filterStatus !== "" && emp.status !== filterStatus) return false;

    return true;
  });

  renderEmployeesFiltered(filtered);
}

// --- مسح الفلاتر وإعادة عرض كل الموظفين
function clearFilters() {
  document.getElementById("searchName").value = "";
  document.getElementById("filterRole").value = "";
  document.getElementById("minSalary").value = "";
  document.getElementById("maxSalary").value = "";
  document.getElementById("minBonus").value = "";
  document.getElementById("maxBonus").value = "";
  document.getElementById("filterStatus").value = "";
  renderEmployees();
}

// --- زر تبديل القائمة الجانبية
function toggleSidebar(){
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("active");
}

// --- زر تبديل عرض المحذوفات
const toggleDeletedBtn = document.getElementById("toggleDeletedBtn");
const deletedEmployeesSection = document.getElementById("deletedEmployeesSection");
toggleDeletedBtn.addEventListener("click", () => {
  if(deletedEmployeesSection.style.display === "none" || deletedEmployeesSection.style.display === ""){
    deletedEmployeesSection.style.display = "block";
  } else {
    deletedEmployeesSection.style.display = "none";
  }
});




// --- ربط أزرار تطبيق ومسح الفلاتر
applyFiltersBtn.addEventListener("click", applyFilters);
clearFiltersBtn.addEventListener("click", clearFilters);

clearFiltersBtn.addEventListener("click", () => {
  // امسح القيم من كل حقول الفلتر
  document.getElementById("searchName").value = "";
  document.getElementById("filterRole").value = "";
  document.getElementById("minSalary").value = "";
  document.getElementById("maxSalary").value = "";
  document.getElementById("minBonus").value = "";
  document.getElementById("maxBonus").value = "";
  document.getElementById("filterStatus").value = "";

  // أخفي قائمة الفلاتر
  filterDropdown.style.display = "none";

  // يمكن هنا إعادة عرض كل الموظفين بدون فلتر (حسب الكود الخاص بك)
  renderEmployees();
});

// --- إغلاق المودال عند الضغط خارج المحتوى
window.onclick = function(event) {
  const employeeModal = document.getElementById("employeeModal");
  const bonusModal = document.getElementById("bonusModal");
  if(event.target === employeeModal){
    closeModal();
  }
  if(event.target === bonusModal){
    closeBonusModal();
  }
};
// --- زر إظهار/إخفاء الفلاتر
filterToggleBtn.addEventListener("click", () => {
  if(filterDropdown.style.display === "flex" || filterDropdown.style.display === "block"){
    filterDropdown.style.display = "none";
  } else {
    filterDropdown.style.display = "flex"; // أو "block" حسب التصميم
  }
});
// --- عرض بيانات الموظفين والمحذوفين عند تحميل الصفحة
renderEmployees();
renderDeletedEmployees();
