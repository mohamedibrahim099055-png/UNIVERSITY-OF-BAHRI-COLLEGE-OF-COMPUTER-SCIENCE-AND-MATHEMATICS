/**
 * University of Bahri - Computer Science & Mathematics Portal
 * Core Application JavaScript Logic
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- STATE MANAGEMENT ---
  let role = 'student'; // 'student' | 'doctor'
  let activeTab = 'timetable'; // 'timetable' | 'materials' | 'add-schedule' | 'upload-material'
  
  let selectedYear = '1';
  let scheduleGroup = 'first_half'; // 'first_half' | 'second_half'
  let selectedDept = 'common'; // 'common' | 'cs' | 'math'
  let selectedSpec = 'all';
  let selectedDay = 'السبت';
  let selectedSemester = 'sem1'; // 'sem1' | 'sem2'
  let searchQuery = '';

  const DOCTOR_PASSWORD = 'bahri123';

  const firstHalfDays = ['السبت', 'الأحد', 'الإثنين'];
  const secondHalfDays = ['الثلاثاء', 'الأربعاء', 'الخميس'];

  // --- 6 CORE SUBJECTS PER SEMESTER (YEARS 1 & 2) ---
  const commonSemesterSubjects = {
    '1': {
      'sem1': [
        { code: 'CS111', name: 'مقدمة في علوم الحاسوب والبرمجة' },
        { code: 'MATH111', name: 'الرياضيات العامة والتفاضل والتكامل (1)' },
        { code: 'PHYS111', name: 'الفيزياء العامة وتطبيقاتها' },
        { code: 'ENG111', name: 'اللغة الإنجليزية الأكاديمية (1)' },
        { code: 'STAT111', name: 'مبادئ الإحصاء والاحتمالات' },
        { code: 'ISL111', name: 'الدراسات الإسلامية والثقافة القرأنية' }
      ],
      'sem2': [
        { code: 'CS122', name: 'أساسيات البرمجة والهيكلة (C++)' },
        { code: 'MATH122', name: 'التفاضل والتكامل (2) والجبر الخطي' },
        { code: 'ELEC122', name: 'الدوائر الكهربائية والإلكترونية' },
        { code: 'ENG122', name: 'اللغة الإنجليزية المصطلحات الأكاديمية (2)' },
        { code: 'ARAB122', name: 'اللغة العربية والمهارات اللغوية' },
        { code: 'HUM122', name: 'المهارات الحياتية والتواصل الأكاديمي' }
      ]
    },
    '2': {
      'sem1': [
        { code: 'CS211', name: 'هياكل البيانات والخوارزميات (1)' },
        { code: 'MATH211', name: 'الرياضيات المتقطعة (Discrete Math)' },
        { code: 'CS212', name: 'البرمجة كائنية التوجه (Java/OOP)' },
        { code: 'ELEC211', name: 'التصميم الرقمي والطقوس المنطقية' },
        { code: 'STAT211', name: 'الإحصاء التطبيقي ونظريات الاحتمال' },
        { code: 'MATH212', name: 'المعادلات التفاضلية العادية' }
      ],
      'sem2': [
        { code: 'CS221', name: 'تنعيم نظم قواعد البيانات (Database Systems)' },
        { code: 'CS222', name: 'معمارية الحاسوب وتنظيم المعالج' },
        { code: 'CS223', name: 'مبادئ هندسة البرمجيات' },
        { code: 'MATH221', name: 'التحليل العددي والحسابي' },
        { code: 'NET221', name: 'أساسيات شبكات الحاسوب' },
        { code: 'CS224', name: 'خوارزميات البحث والتحسين' }
      ]
    }
  };

  // --- INITIAL DATA ---
  let schedules = [
    {
      id: 'SCH-101',
      year: '1',
      dept: 'common',
      group: 'first_half',
      subject: 'مقدمة في علوم الحاسوب والبرمجة',
      code: 'CS111',
      doctor: 'د. داليا طه إبراهيم',
      day: 'السبت',
      time: '08:00 ص - 10:00 ص',
      hall: 'القاعة الكبرى - مجمع بحري (1)',
      type: 'محاضرة نظرية'
    },
    {
      id: 'SCH-102',
      year: '1',
      dept: 'common',
      group: 'first_half',
      subject: 'الرياضيات العامة والتفاضل والتكامل (1)',
      code: 'MATH111',
      doctor: 'بروف. الكندي يوسف',
      day: 'الأحد',
      time: '10:15 ص - 12:15 ظ',
      hall: 'مدرج ابن الهيثم (3)',
      type: 'محاضرة نظرية'
    },
    {
      id: 'SCH-201',
      year: '2',
      dept: 'common',
      group: 'second_half',
      subject: 'هياكل البيانات والخوارزميات (1)',
      code: 'CS211',
      doctor: 'د. الفاتح الأمين',
      day: 'الأربعاء',
      time: '08:00 ص - 10:00 ص',
      hall: 'معمل الحاسوب المركزي (2)',
      type: 'معمل وتطبيق عملي'
    },
    {
      id: 'SCH-501',
      year: '5',
      dept: 'cs',
      specialization: 'cs',
      group: 'first_half',
      subject: 'مشروع التخرج المتقدم بمرتبة الشرف (Honors Thesis)',
      code: 'CS509',
      doctor: 'بروف. الكندي يوسف & د. داليا طه',
      day: 'السبت',
      time: '09:00 ص - 01:00 ظ',
      hall: 'قاعة السمينارات ومشاريع الشرف',
      type: 'مناقشة وإشراف بحثي'
    }
  ];

  let materials = [
    {
      id: 'MAT-101',
      title: 'سلايد المحاضرة الأولى: مفاهيم البرمجة بلغة C++',
      subject: 'مقدمة في علوم الحاسوب والبرمجة',
      code: 'CS111',
      year: '1',
      semester: 'sem1',
      doctor: 'د. داليا طه إبراهيم',
      size: '2.4 MB',
      type: 'pdf'
    },
    {
      id: 'MAT-102',
      title: 'شيت التمارين الأول - التفاضل والتكامل',
      subject: 'الرياضيات العامة والتفاضل والتكامل (1)',
      code: 'MATH111',
      year: '1',
      semester: 'sem1',
      doctor: 'بروف. الكندي يوسف',
      size: '1.8 MB',
      type: 'pdf'
    },
    {
      id: 'MAT-201',
      title: 'ملخص الخوارزميات والمصفوفات الديناميكية',
      subject: 'هياكل البيانات والخوارزميات (1)',
      code: 'CS211',
      year: '2',
      semester: 'sem1',
      doctor: 'د. الفاتح الأمين',
      size: '4.1 MB',
      type: 'pdf'
    }
  ];

  // --- DOM ELEMENTS ---
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  
  const authModal = document.getElementById('auth-modal');
  const authForm = document.getElementById('auth-form');
  const passwordInput = document.getElementById('password-input');
  const passwordError = document.getElementById('password-error');
  const closeModalBtn = document.getElementById('close-modal-btn');

  const roleStudentBtn = document.getElementById('role-student-btn');
  const roleDoctorBtn = document.getElementById('role-doctor-btn');

  const yearSelector = document.getElementById('year-selector');
  const groupFirstBtn = document.getElementById('group-first-btn');
  const groupSecondBtn = document.getElementById('group-second-btn');

  const deptSelectorContainer = document.getElementById('dept-selector-container');
  const sharedYearsIndicator = document.getElementById('shared-years-indicator');
  const deptCsBtn = document.getElementById('dept-cs-btn');
  const deptMathBtn = document.getElementById('dept-math-btn');
  const specSelect = document.getElementById('spec-select');

  const tabTimetableBtn = document.getElementById('tab-timetable-btn');
  const tabMaterialsBtn = document.getElementById('tab-materials-btn');
  const searchInput = document.getElementById('search-input');
  const doctorActions = document.getElementById('doctor-actions');
  const addScheduleBtn = document.getElementById('add-schedule-btn');
  const uploadMaterialBtn = document.getElementById('upload-material-btn');

  const daySelector = document.getElementById('day-selector');
  const scheduleGrid = document.getElementById('schedule-grid');
  
  const semesterBar = document.getElementById('semester-bar');
  const sem1Btn = document.getElementById('sem1-btn');
  const sem2Btn = document.getElementById('sem2-btn');
  const materialsGrid = document.getElementById('materials-grid');
  const materialsCount = document.getElementById('materials-count');

  // --- HELPER FUNCTIONS ---
  function showToast(msg) {
    toastMessage.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 4000);
  }

  function switchTab(tabName) {
    activeTab = tabName;
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    if (tabName === 'timetable') {
      document.getElementById('timetable-section').classList.add('active');
      tabTimetableBtn.classList.add('active');
    } else if (tabName === 'materials') {
      document.getElementById('materials-section').classList.add('active');
      tabMaterialsBtn.classList.add('active');
    } else if (tabName === 'add-schedule') {
      document.getElementById('add-schedule-section').classList.add('active');
    } else if (tabName === 'upload-material') {
      document.getElementById('upload-material-section').classList.add('active');
    }
    render();
  }

  // --- RENDER LOGIC ---
  function render() {
    // 1. Role Toggle Sync
    if (role === 'doctor') {
      roleDoctorBtn.classList.add('active');
      roleStudentBtn.classList.remove('active');
      doctorActions.classList.remove('hidden');
    } else {
      roleStudentBtn.classList.add('active');
      roleDoctorBtn.classList.remove('active');
      doctorActions.classList.add('hidden');
    }

    // 2. Department Visibility for Years 3, 4, 5
    if (selectedYear === '1' || selectedYear === '2') {
      deptSelectorContainer.classList.add('hidden');
      sharedYearsIndicator.classList.remove('hidden');
      semesterBar.classList.remove('hidden');
    } else {
      deptSelectorContainer.classList.remove('hidden');
      sharedYearsIndicator.classList.add('hidden');
      semesterBar.classList.add('hidden');
    }

    // Update Specializations dropdown options
    specSelect.innerHTML = '';
    if (selectedDept === 'cs') {
      specSelect.innerHTML = `
        <option value="all">كل التخصصات (حاسوب)</option>
        <option value="cs">علوم الحاسوب (CS)</option>
        <option value="it">تقنية المعلومات (IT)</option>
        <option value="networks">الشبكات (Networks)</option>
      `;
    } else {
      specSelect.innerHTML = `
        <option value="all">كل التخصصات (رياضيات)</option>
        <option value="math">الرياضيات (Math)</option>
        <option value="stat">الإحصاء (Stat)</option>
      `;
    }

    // 3. Render Day Buttons
    const currentDays = scheduleGroup === 'first_half' ? firstHalfDays : secondHalfDays;
    daySelector.innerHTML = '';
    currentDays.forEach(day => {
      const btn = document.createElement('button');
      btn.className = `day-btn ${selectedDay === day ? 'active' : ''}`;
      btn.textContent = day;
      btn.onclick = () => {
        selectedDay = day;
        render();
      };
      daySelector.appendChild(btn);
    });

    // 4. Render Timetable Cards
    renderSchedule(currentDays);

    // 5. Render Materials / 6 Core Subjects
    renderMaterials();
  }

  function renderSchedule(currentDays) {
    scheduleGrid.innerHTML = '';
    const filtered = schedules.filter(s => {
      if (s.year !== selectedYear) return false;
      if (s.group !== scheduleGroup) return false;
      if (s.day !== selectedDay) return false;
      if (selectedYear !== '1' && selectedYear !== '2' && selectedDept !== 'common') {
        if (s.dept !== selectedDept) return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return s.subject.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.doctor.toLowerCase().includes(q);
      }
      return true;
    });

    if (filtered.length === 0) {
      scheduleGrid.innerHTML = `
        <div class="empty-state">
          <i class="fa-regular fa-calendar-xmark"></i>
          <p>لا توجد محاضرات مجدولة يوم (${selectedDay}) لهذه السنة والمجموعة!</p>
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'schedule-card';
      card.innerHTML = `
        <div>
          <div class="card-top">
            <span class="code-badge">${item.code}</span>
            <span class="type-badge">${item.type}</span>
          </div>
          <h3 class="card-title">${item.subject}</h3>
          <p class="card-doctor"><i class="fa-solid fa-user-tie"></i> ${item.doctor}</p>
        </div>
        <div class="card-details">
          <div class="detail-item"><i class="fa-regular fa-clock icon-gold"></i> التوقيت: ${item.time}</div>
          <div class="detail-item"><i class="fa-solid fa-location-dot icon-emerald"></i> المكان: ${item.hall}</div>
        </div>
      `;
      scheduleGrid.appendChild(card);
    });
  }

  function renderMaterials() {
    materialsGrid.innerHTML = '';
    materialsCount.textContent = materials.length;

    if (selectedYear === '1' || selectedYear === '2') {
      const subjects = commonSemesterSubjects[selectedYear][selectedSemester];
      subjects.forEach(sub => {
        const subFiles = materials.filter(m => m.year === selectedYear && (m.semester === selectedSemester || !m.semester) && (m.code === sub.code || m.subject.includes(sub.name)));
        
        const card = document.createElement('div');
        card.className = 'subject-card';
        
        let filesHTML = '';
        if (subFiles.length === 0) {
          filesHTML = `<p class="hint-text text-center">لا توجد ملفات مرفوعة لهذه المادة حتى الآن.</p>`;
        } else {
          filesHTML = subFiles.map(f => `
            <div class="file-item">
              <div class="file-meta">
                <div class="file-icon"><i class="fa-solid fa-file-pdf"></i></div>
                <div class="file-info">
                  <p>${f.title}</p>
                  <small>${f.size} • ${f.doctor}</small>
                </div>
              </div>
              <button class="btn-download" onclick="downloadFile('${f.title}')">
                <i class="fa-solid fa-download"></i> تحميل
              </button>
            </div>
          `).join('');
        }

        card.innerHTML = `
          <div>
            <div class="card-top">
              <span class="code-badge">${sub.code}</span>
              <small class="hint-text">${subFiles.length} ملفات جاهزة</small>
            </div>
            <h3 class="card-title">${sub.name}</h3>
            <p class="hint-text">مادة أساسية معتمدة • 6 ساعات معتمدة</p>
          </div>
          <div class="files-list">
            <span class="filter-sublabel">الملفات والمحاضرات المتاحة:</span>
            ${filesHTML}
          </div>
        `;
        materialsGrid.appendChild(card);
      });
    } else {
      const filtered = materials.filter(m => m.year === selectedYear);
      if (filtered.length === 0) {
        materialsGrid.innerHTML = `<div class="empty-state"><i class="fa-solid fa-folder-open"></i><p>لا توجد ملفات مرفوعة لهذا التخصص.</p></div>`;
        return;
      }

      filtered.forEach(f => {
        const card = document.createElement('div');
        card.className = 'subject-card';
        card.innerHTML = `
          <div class="card-top">
            <span class="code-badge">${f.code || 'مرجع'}</span>
          </div>
          <h3 class="card-title">${f.title}</h3>
          <p class="card-doctor"><i class="fa-solid fa-user-tie"></i> ${f.doctor}</p>
          <button class="btn btn-indigo" onclick="downloadFile('${f.title}')">
            <i class="fa-solid fa-download"></i> تحميل المستند (${f.size})
          </button>
        `;
        materialsGrid.appendChild(card);
      });
    }
  }

  // --- GLOBAL FILE DOWNLOAD MOCK ---
  window.downloadFile = function(title) {
    showToast(`جاري تنزيل الملف: ${title}`);
  };

  // --- EVENT LISTENERS ---

  // Role Switching
  roleStudentBtn.onclick = () => {
    role = 'student';
    if (activeTab === 'add-schedule' || activeTab === 'upload-material') {
      switchTab('timetable');
    } else {
      render();
    }
  };

  roleDoctorBtn.onclick = () => {
    if (role !== 'doctor') {
      passwordInput.value = '';
      passwordError.classList.add('hidden');
      authModal.classList.remove('hidden');
    }
  };

  closeModalBtn.onclick = () => authModal.classList.add('hidden');

  authForm.onsubmit = (e) => {
    e.preventDefault();
    if (passwordInput.value === DOCTOR_PASSWORD) {
      role = 'doctor';
      authModal.classList.add('hidden');
      showToast('تم تسجيل الدخول بنجاح إلى لوحة المحاضر!');
      render();
    } else {
      passwordError.classList.remove('hidden');
    }
  };

  // Year Selection
  yearSelector.addEventListener('click', (e) => {
    if (e.target.classList.contains('year-btn')) {
      document.querySelectorAll('.year-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      selectedYear = e.target.dataset.year;
      if (selectedYear === '1' || selectedYear === '2') {
        selectedDept = 'common';
      } else {
        selectedDept = 'cs';
      }
      render();
    }
  });

  // Group Selection
  groupFirstBtn.onclick = () => {
    scheduleGroup = 'first_half';
    selectedDay = 'السبت';
    groupFirstBtn.classList.add('active');
    groupSecondBtn.classList.remove('active');
    render();
  };

  groupSecondBtn.onclick = () => {
    scheduleGroup = 'second_half';
    selectedDay = 'الثلاثاء';
    groupSecondBtn.classList.add('active');
    groupFirstBtn.classList.remove('active');
    render();
  };

  // Department Selection
  deptCsBtn.onclick = () => {
    selectedDept = 'cs';
    deptCsBtn.classList.add('active');
    deptMathBtn.classList.remove('active');
    render();
  };

  deptMathBtn.onclick = () => {
    selectedDept = 'math';
    deptMathBtn.classList.add('active');
    deptCsBtn.classList.remove('active');
    render();
  };

  // Semester Selection
  sem1Btn.onclick = () => {
    selectedSemester = 'sem1';
    sem1Btn.classList.add('active');
    sem2Btn.classList.remove('active');
    renderMaterials();
  };

  sem2Btn.onclick = () => {
    selectedSemester = 'sem2';
    sem2Btn.classList.add('active');
    sem1Btn.classList.remove('active');
    renderMaterials();
  };

  // Tabs
  tabTimetableBtn.onclick = () => switchTab('timetable');
  tabMaterialsBtn.onclick = () => switchTab('materials');
  addScheduleBtn.onclick = () => switchTab('add-schedule');
  uploadMaterialBtn.onclick = () => switchTab('upload-material');

  document.querySelectorAll('.cancel-tab-btn').forEach(b => {
    b.onclick = () => switchTab('timetable');
  });

  // Search
  searchInput.oninput = (e) => {
    searchQuery = e.target.value;
    render();
  };

  // Populate Add Schedule Days Select
  const schGroupSelect = document.getElementById('sch-group');
  const schDaySelect = document.getElementById('sch-day');

  function updateSchDays() {
    const days = schGroupSelect.value === 'first_half' ? firstHalfDays : secondHalfDays;
    schDaySelect.innerHTML = days.map(d => `<option value="${d}">${d}</option>`).join('');
  }
  schGroupSelect.onchange = updateSchDays;
  updateSchDays();

  // Form Submissions
  document.getElementById('new-schedule-form').onsubmit = (e) => {
    e.preventDefault();
    const newSch = {
      id: `SCH-${Math.floor(Math.random() * 900 + 100)}`,
      subject: document.getElementById('sch-subject').value,
      code: document.getElementById('sch-code').value,
      year: document.getElementById('sch-year').value,
      group: document.getElementById('sch-group').value,
      day: document.getElementById('sch-day').value,
      time: document.getElementById('sch-time').value,
      hall: document.getElementById('sch-hall').value,
      doctor: 'د. داليا طه إبراهيم',
      type: 'محاضرة نظرية'
    };
    schedules.push(newSch);
    showToast('تم إضافة المحاضرة بنجاح إلى جدول القاعات!');
    switchTab('timetable');
  };

  document.getElementById('new-material-form').onsubmit = (e) => {
    e.preventDefault();
    const newMat = {
      id: `MAT-${Math.floor(Math.random() * 900 + 100)}`,
      title: document.getElementById('mat-title').value,
      subject: document.getElementById('mat-subject').value,
      code: document.getElementById('mat-code').value || 'CS100',
      type: document.getElementById('mat-type').value,
      year: document.getElementById('mat-year').value,
      semester: document.getElementById('mat-semester').value,
      doctor: 'د. داليا طه إبراهيم',
      size: '3.2 MB'
    };
    materials.unshift(newMat);
    showToast('تم نشر المادة والمستند الأكاديمي بنجاح!');
    switchTab('materials');
  };

  // INITIAL RUN
  render();
});
