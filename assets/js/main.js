// Mualimi - Main JavaScript Logic
const API_URL = 'http://localhost:5000/api';

// Global function for role selection - MUST be defined BEFORE DOMContentLoaded
window.selectRole = (role) => {
    console.log('Selecting role:', role);
    localStorage.setItem('mualimi_role', role);
    if (role === 'teacher') {
        window.location.href = 'teacher-dashboard.html';
    } else {
        window.location.href = 'student-dashboard.html';
    }
};

// Notification utility
function showNotification(message, type = 'success') {
    const notificationHtml = `
        <div class="alert alert-${type === 'error' ? 'danger' : 'success'} alert-dismissible fade show" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', notificationHtml);
    setTimeout(() => {
        const alerts = document.querySelectorAll('.alert');
        if (alerts.length > 0) {
            alerts[0].remove();
        }
    }, 3000);
}

// Load dashboard data based on role
async function loadDashboardData() {
    const role = localStorage.getItem('mualimi_role') || 'student';
    
    try {
        if (role === 'teacher' && window.location.pathname.includes('teacher')) {
            // Load teacher dashboard data
            const studentCount = document.querySelector('[data-student-count]');
            if (studentCount) {
                const response = await api.getAllStudents();
                studentCount.innerText = response.count || 0;
            }

            const quizCount = document.querySelector('[data-quiz-count]');
            if (quizCount) {
                const response = await api.getAllQuizzes();
                quizCount.innerText = response.count || 0;
            }
        } else if (role === 'student' && window.location.pathname.includes('student')) {
            // Load student dashboard data
            const quizCount = document.querySelector('#active-quizzes-count');
            if (quizCount) {
                const response = await api.getActiveQuizzes();
                quizCount.innerText = `لديك ${response.count || 0} اختبار جديد`;
            }
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Mualimi System Initialized');
    
    // Test backend connection
    try {
        const health = await api.checkHealth();
        console.log('✅ Connected to Backend:', health.message);
    } catch (error) {
        console.error('❌ Backend Connection Failed:', error);
        showNotification('خطأ في الاتصال بالخادم. تأكد من تشغيل الخادم.', 'error');
    }

    // --- Sidebar & Navigation ---

    // Handle Mobile Sidebar Toggle
    const toggleBtn = document.querySelector('.mobile-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            const icon = toggleBtn.querySelector('i');
            if (sidebar.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }

    // Logout Confirmation
    const logoutLinks = document.querySelectorAll('a[href*="index.html"]');
    logoutLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (!confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                e.preventDefault();
            }
        });
    });

    // Handle active state for Student Bottom Nav
    const bottomNavItems = document.querySelectorAll('.nav-item');
    bottomNavItems.forEach(item => {
        item.addEventListener('click', () => {
            bottomNavItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Sidebar link active state and auto-close on mobile
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            if (window.innerWidth <= 768 && sidebar) {
                sidebar.classList.remove('active');
                if (toggleBtn) {
                    const icon = toggleBtn.querySelector('i');
                    icon.classList.replace('fa-times', 'fa-bars');
                }
            }
        });
    });

    // --- Functional Logic & Notifications ---

    // --- Profile & Dashboard Polish ---

    // Dynamic Profile Name (from localStorage)
    const profileNames = document.querySelectorAll('.sidebar h3, .sidebar p, .main-content h2, .main-content p.fw-bold, .student-header h4');
    const savedName = localStorage.getItem('mualimi_user_name');
    if (savedName) {
        profileNames.forEach(el => {
            if (el.innerText.includes('أحمد') || el.innerText.includes('ياسين') || el.innerText.includes('الفولي') || el.innerText.includes('عمده')) {
                el.innerText = el.innerText.replace(/أحمد|ياسين|الفولي|عمده/g, savedName);
            }
        });
    }

    // Allow clicking on profile name to change it (Teacher & Student)
    const editableNames = document.querySelectorAll('.main-content p.fw-bold, .student-header h4');
    editableNames.forEach(nameEl => {
        nameEl.style.cursor = 'pointer';
        nameEl.title = 'انقر لتغيير الاسم';
        nameEl.addEventListener('click', () => {
            const newName = prompt('أدخل الاسم الجديد:', nameEl.innerText.replace('مرحباً، ', ''));
            if (newName) {
                localStorage.setItem('mualimi_user_name', newName);
                location.reload();
            }
        });
    });

    // Load and display dashboard data
    await loadDashboardData();
});

// Notification utility
function showNotification(message, type = 'success') {
    const notificationHtml = `
        <div class="alert alert-${type === 'error' ? 'danger' : 'success'} alert-dismissible fade show" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', notificationHtml);
    setTimeout(() => {
        const alerts = document.querySelectorAll('.alert');
        if (alerts.length > 0) {
            alerts[0].remove();
        }
    }, 3000);
}

// Load dashboard data based on role
async function loadDashboardData() {
    const role = localStorage.getItem('mualimi_role') || 'student';
    
    try {
        if (role === 'teacher' && window.location.pathname.includes('teacher')) {
            // Load teacher dashboard data
            const studentCount = document.querySelector('[data-student-count]');
            if (studentCount) {
                const response = await api.getAllStudents();
                studentCount.innerText = response.count || 0;
            }

            const quizCount = document.querySelector('[data-quiz-count]');
            if (quizCount) {
                const response = await api.getAllQuizzes();
                quizCount.innerText = response.count || 0;
            }
        } else if (role === 'student' && window.location.pathname.includes('student')) {
            // Load student dashboard data
            const quizCount = document.querySelector('#active-quizzes-count');
            if (quizCount) {
                const response = await api.getActiveQuizzes();
                quizCount.innerText = `لديك ${response.count || 0} اختبار جديد`;
            }
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

    // --- Reports & Charts ---
    const gradesCtx = document.getElementById('gradesChart');
    if (gradesCtx) {
        new Chart(gradesCtx, {
            type: 'bar',
            data: {
                labels: ['ممتاز', 'جيد جداً', 'جيد', 'مقبول', 'ضعيف'],
                datasets: [{
                    label: 'عدد الطلاب',
                    data: [45, 30, 20, 10, 5],
                    backgroundColor: [
                        'rgba(46, 204, 113, 0.7)',
                        'rgba(52, 152, 219, 0.7)',
                        'rgba(241, 196, 15, 0.7)',
                        'rgba(230, 126, 34, 0.7)',
                        'rgba(231, 76, 60, 0.7)'
                    ],
                    borderColor: [
                        '#2ecc71', '#3498db', '#f1c40f', '#e67e22', '#e74c3c'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // Generic Notification System
    window.showNotification = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'} me-2"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    };

    // Save Attendance
    const saveAttBtn = document.getElementById('save-attendance-btn');
    if (saveAttBtn) {
        saveAttBtn.addEventListener('click', () => {
            const rows = document.querySelectorAll('tbody tr');
            let present = 0;
            let absent = 0;
            
            rows.forEach(row => {
                const radios = row.querySelectorAll('input[type="radio"]');
                if (radios[0].checked) present++;
                else if (radios[1].checked) absent++;
            });

            showNotification(`تم حفظ التحضير: ${present} حاضر، ${absent} غائب`);
        });
    }

    // Quiz Creator Actions
    const addQuestionBtn = document.getElementById('add-question-btn');
    const questionsContainer = document.getElementById('questions-container');
    if (addQuestionBtn && questionsContainer) {
        addQuestionBtn.addEventListener('click', () => {
            const questionCount = questionsContainer.children.length + 1;
            const newQuestion = document.createElement('div');
            newQuestion.className = 'card border p-3 mb-3 bg-light fade-in';
            newQuestion.innerHTML = `
                <div class="d-flex justify-content-between mb-3">
                    <h6 class="fw-bold">سؤال ${questionCount}</h6>
                    <button class="btn btn-sm btn-outline-danger" title="حذف السؤال"><i class="fas fa-trash"></i></button>
                </div>
                <textarea class="form-control mb-3" placeholder="اكتب السؤال هنا..."></textarea>
                <div class="row g-2">
                    <div class="col-6"><input type="text" class="form-control form-control-sm" placeholder="الخيار 1"></div>
                    <div class="col-6"><input type="text" class="form-control form-control-sm" placeholder="الخيار 2"></div>
                    <div class="col-6"><input type="text" class="form-control form-control-sm" placeholder="الخيار 3"></div>
                    <div class="col-6"><input type="text" class="form-control form-control-sm" placeholder="الخيار 4"></div>
                </div>
            `;
            questionsContainer.appendChild(newQuestion);
            showNotification('تم إضافة سؤال جديد');
            
            // Re-bind delete event for new button
            newQuestion.querySelector('.btn-outline-danger').addEventListener('click', function() {
                if (confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
                    newQuestion.remove();
                }
            });
        });
    }

    const saveDraftBtn = document.getElementById('save-draft-btn');
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', () => {
            showNotification('تم حفظ الاختبار كمسودة', 'info');
        });
    }

    // --- Quiz Logic (Publish & Render) ---
    const publishQuizBtn = document.getElementById('publish-quiz-btn');
    if (publishQuizBtn) {
        publishQuizBtn.addEventListener('click', () => {
            const title = document.getElementById('quiz-title').value;
            const group = document.getElementById('target-group').value;
            if (title) {
                const quizzes = JSON.parse(localStorage.getItem('mualimi_quizzes')) || [];
                quizzes.push({
                    id: Date.now(),
                    title: title,
                    group: group,
                    questions: 5,
                    duration: 15
                });
                localStorage.setItem('mualimi_quizzes', JSON.stringify(quizzes));
                showNotification('تم نشر الاختبار بنجاح!');
                setTimeout(() => window.location.href = 'reports.html', 1500);
            } else {
                showNotification('يرجى إدخال عنوان للاختبار', 'error');
            }
        });
    }

    const studentQuizzesContainer = document.getElementById('student-quizzes-container');
    if (studentQuizzesContainer) {
        const quizzes = JSON.parse(localStorage.getItem('mualimi_quizzes')) || [
            { id: 1, title: 'اختبار اللغة العربية - الأسبوع 4', duration: 30, questions: 10 },
            { id: 2, title: 'اختبار القواعد والنحو', duration: 15, questions: 5 }
        ];

        studentQuizzesContainer.innerHTML = '';
        quizzes.reverse().forEach(quiz => {
            const card = document.createElement('div');
            card.className = 'quiz-card fade-in';
            card.innerHTML = `
                <div>
                    <h6 class="fw-bold mb-1">${quiz.title}</h6>
                    <p class="small text-muted mb-0"><i class="far fa-clock me-1"></i> ${quiz.duration} دقيقة | ${quiz.questions} أسئلة</p>
                </div>
                <button class="btn btn-primary btn-sm rounded-pill px-3 start-quiz-btn" data-title="${quiz.title}">ابدأ</button>
            `;
            studentQuizzesContainer.appendChild(card);
        });

        document.querySelectorAll('.start-quiz-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const title = this.dataset.title;
                if (confirm(`هل أنت مستعد لبدء ${title}؟`)) {
                    showNotification('جاري تحميل الاختبار...');
                }
            });
        });
    }

    const activeQuizzesCount = document.getElementById('active-quizzes-count');
    if (activeQuizzesCount) {
        const quizzes = JSON.parse(localStorage.getItem('mualimi_quizzes')) || [
            { id: 1 }, { id: 2 }
        ];
        activeQuizzesCount.innerText = `لديك ${quizzes.length} اختبار جديد`;
    }

    // --- Group Management (LocalStorage & Search) ---
    const groupsContainer = document.getElementById('groups-container');
    const searchInput = document.getElementById('search-groups');
    const dashboardTableBody = document.getElementById('dashboard-quizzes-body');
    
    // Initial Data
    let groups = JSON.parse(localStorage.getItem('mualimi_groups')) || [
        { id: 1, name: 'المجموعة أ', course: 'اللغة العربية - المستوى الأول', students: 25, date: '2024/05/01' },
        { id: 2, name: 'المجموعة ب', course: 'نحو وصرف - المستوى الثاني', students: 18, date: '2024/05/03' }
    ];

    const renderDashboardTable = () => {
        if (!dashboardTableBody) return;
        dashboardTableBody.innerHTML = '';
        
        // Show last 5 groups as quizzes for demo
        groups.slice(-5).reverse().forEach(group => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>اختبار ${group.name}</td>
                <td>${group.name}</td>
                <td>${group.date || '2024/05/10'}</td>
                <td><span class="badge bg-success">نشط</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-secondary table-edit-btn" title="تعديل"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-outline-danger table-delete-btn" data-id="${group.id}" title="حذف"><i class="fas fa-trash"></i></button>
                </td>
            `;
            dashboardTableBody.appendChild(tr);
        });

        // Re-attach info listeners for dashboard buttons
        dashboardTableBody.querySelectorAll('.table-edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                showNotification('هذه الميزة متاحة في صفحة "المجموعات" حالياً', 'info');
            });
        });

        // Dashboard Delete Logic
        dashboardTableBody.querySelectorAll('.table-delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                if (confirm('هل أنت متأكد من حذف هذه المجموعة؟')) {
                    groups = groups.filter(g => g.id !== id);
                    localStorage.setItem('mualimi_groups', JSON.stringify(groups));
                    renderDashboardTable();
                    showNotification('تم حذف المجموعة والبيانات المرتبطة بها');
                }
            });
        });
    };

    const renderGroupSelects = () => {
        const selects = document.querySelectorAll('#group-select, #target-group');
        selects.forEach(select => {
            const currentValue = select.value;
            select.innerHTML = '';
            groups.forEach(group => {
                const option = document.createElement('option');
                option.value = group.name;
                option.textContent = group.name;
                select.appendChild(option);
            });
            // Try to restore previous value if it still exists
            if (currentValue) select.value = currentValue;
        });
    };

    let currentEditId = null;

    const renderGroups = (filter = '') => {
        // Sync everything
        renderGroupSelects();
        
        if (!groupsContainer) {
            renderDashboardTable();
            return;
        }
        
        groupsContainer.innerHTML = '';
        const filtered = groups.filter(g => 
            g.name.toLowerCase().includes(filter.toLowerCase()) || 
            g.course.toLowerCase().includes(filter.toLowerCase())
        );

        if (filtered.length === 0) {
            groupsContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-search fa-3x text-light-gray mb-3"></i>
                    <p class="text-muted">لم يتم العثور على نتائج لمطابقة بحثك</p>
                </div>
            `;
            return;
        }

        filtered.forEach(group => {
            const card = document.createElement('div');
            card.className = 'col-md-4 fade-in';
            card.innerHTML = `
                <div class="card border p-3 h-100">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <span class="badge bg-light text-primary p-2">${group.name}</span>
                        <div class="dropdown">
                            <button class="btn btn-link text-muted p-0" data-bs-toggle="dropdown"><i class="fas fa-ellipsis-v"></i></button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item edit-group" href="#" data-id="${group.id}">تعديل</a></li>
                                <li><a class="dropdown-item text-danger delete-group" href="#" data-id="${group.id}">حذف</a></li>
                            </ul>
                        </div>
                    </div>
                    <h6 class="fw-bold">${group.course}</h6>
                    <p class="small text-muted mb-3"><i class="fas fa-user-friends me-1"></i> ${group.students} طالب</p>
                    <button class="btn btn-sm btn-outline-primary w-100" data-bs-toggle="modal" data-bs-target="#viewStudentsModal">عرض الطلاب</button>
                </div>
            `;
            groupsContainer.appendChild(card);
        });

        // Re-attach delete listeners
        document.querySelectorAll('.delete-group').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = parseInt(btn.dataset.id);
                if (confirm('هل أنت متأكد من حذف هذه المجموعة؟')) {
                    groups = groups.filter(g => g.id !== id);
                    localStorage.setItem('mualimi_groups', JSON.stringify(groups));
                    renderGroups(searchInput ? searchInput.value : '');
                    showNotification('تم حذف المجموعة');
                }
            });
        });

        // Re-attach edit listeners
        document.querySelectorAll('.edit-group').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = parseInt(btn.dataset.id);
                const group = groups.find(g => g.id === id);
                if (group) {
                    currentEditId = id;
                    document.getElementById('groupName').value = group.name;
                    document.getElementById('courseName').value = group.course;
                    document.getElementById('studentCount').value = group.students;
                    document.getElementById('addGroupModalLabel').innerText = 'تعديل مجموعة';
                    
                    const modal = new bootstrap.Modal(document.getElementById('addGroupModal'));
                    modal.show();
                }
            });
        });
    };

    // Initial Render
    renderGroups();

    // Search Logic
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderGroups(e.target.value);
        });
    }

    // Reset modal when clicking "Add Group"
    const addGroupMainBtn = document.querySelector('[data-bs-target="#addGroupModal"]');
    if (addGroupMainBtn) {
        addGroupMainBtn.addEventListener('click', () => {
            currentEditId = null;
            document.getElementById('addGroupModalLabel').innerText = 'إضافة مجموعة جديدة';
            document.getElementById('add-group-form').reset();
        });
    }

    const saveGroupBtn = document.getElementById('save-group-btn');
    if (saveGroupBtn) {
        saveGroupBtn.addEventListener('click', () => {
            const name = document.getElementById('groupName').value;
            const course = document.getElementById('courseName').value;
            const count = document.getElementById('studentCount').value || 0;

            if (name && course) {
                if (currentEditId) {
                    // Update existing
                    const index = groups.findIndex(g => g.id === currentEditId);
                    if (index !== -1) {
                        groups[index] = { ...groups[index], name, course, students: count };
                        showNotification('تم تحديث بيانات المجموعة');
                    }
                } else {
                    // Add new
                    const newGroup = {
                        id: Date.now(),
                        name: name,
                        course: course,
                        students: count,
                        date: new Date().toLocaleDateString('ar-EG')
                    };
                    groups.push(newGroup);
                    showNotification(`تم إنشاء مجموعة "${name}" بنجاح`);
                }

                localStorage.setItem('mualimi_groups', JSON.stringify(groups));
                renderGroups();
                
                const modalElement = document.getElementById('addGroupModal');
                const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                modal.hide();
                document.getElementById('add-group-form').reset();
            } else {
                showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
            }
        });
    }

    // --- Dashboard Actions ---
    const messageParentsBtn = document.getElementById('message-parents-btn');
    if (messageParentsBtn) {
        messageParentsBtn.addEventListener('click', () => {
            const msg = prompt('اكتب رسالتك لأولياء الأمور:');
            if (msg) {
                showNotification('جاري إرسال الرسائل لجميع أولياء الأمور...');
                setTimeout(() => showNotification('تم الإرسال بنجاح'), 2000);
            }
        });
    }

    // --- Reports Actions ---
    const downloadReportBtn = document.getElementById('download-report-btn');
    if (downloadReportBtn) {
        downloadReportBtn.addEventListener('click', () => {
            showNotification('جاري تجهيز التقرير الشامل...');
            setTimeout(() => showNotification('بدأ التحميل الآن'), 1500);
        });
    }

    // Dashboard/Table Edit Buttons
    const tableEditBtns = document.querySelectorAll('.btn-outline-secondary[title="تعديل"]');
    tableEditBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            showNotification('هذه الميزة متاحة في صفحة "المجموعات" حالياً', 'info');
        });
    });

    // Delete Buttons in tables and cards
    const deleteButtons = document.querySelectorAll('.btn-outline-danger, .dropdown-item.text-danger');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const card = this.closest('.col-md-4'); // For group cards
            
            if (confirm('هل أنت متأكد من هذا الإجراء؟')) {
                const target = row || card;
                if (target) {
                    target.style.transition = 'all 0.3s';
                    target.style.opacity = '0';
                    target.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        target.remove();
                        showNotification('تمت العملية بنجاح');
                    }, 300);
                }
            }
        });
    });
});
