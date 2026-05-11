// Mualimi - Main JavaScript Logic
const API_URL = 'http://localhost:5000/api';
// Helper to get logged in user info
const getUserId = () => localStorage.getItem('mualimi_user_id') || localStorage.getItem('mualimi_student_id');
const getUserRole = () => localStorage.getItem('mualimi_role');

// Logout Function
window.logout = () => {
    localStorage.removeItem('mualimi_role');
    localStorage.removeItem('mualimi_user_id');
    localStorage.removeItem('mualimi_user_name');
    localStorage.removeItem('mualimi_student_id');
    localStorage.removeItem('mualimi_student_name');
    window.location.href = '/login.html';
};

// Generic Notification System
window.showNotification = (message, type = 'success') => {
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999;';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `alert alert-${type === 'error' ? 'danger' : (type === 'info' ? 'info' : 'success')} alert-dismissible fade show shadow`;
    toast.role = 'alert';
    toast.style.minWidth = '300px';
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : (type === 'info' ? 'fa-info-circle' : 'fa-check-circle')} me-2"></i>
            <div>${message}</div>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    container.appendChild(toast);
    setTimeout(() => {
        const bsAlert = bootstrap.Alert.getOrCreateInstance(toast);
        bsAlert.close();
    }, 3000);
};

// Load dashboard statistics
async function loadDashboardStats() {
    const role = localStorage.getItem('mualimi_role') || 'student';
    
    try {
        if (role === 'teacher' && (window.location.pathname.includes('teacher-dashboard') || window.location.pathname.endsWith('/'))) {
            // Fetch All necessary data
            const [studentsRes, quizzesRes, gradesRes] = await Promise.all([
                api.getAllStudents(),
                api.getAllQuizzes(),
                api.getAllGrades()
            ]);

            // Update Stats Cards
            const totalStudentsEl = document.getElementById('total-students-count');
            const activeQuizzesEl = document.getElementById('active-quizzes-count');
            const avgGradeEl = document.getElementById('avg-grade-display');
            const pendingAlertsEl = document.getElementById('pending-alerts-count');

            if (totalStudentsEl) totalStudentsEl.innerText = studentsRes.count || 0;
            if (activeQuizzesEl) activeQuizzesEl.innerText = (quizzesRes.data || []).filter(q => new Date(q.endDate) > new Date()).length;
            
            // Calculate Average Grade
            const grades = gradesRes.data || [];
            if (avgGradeEl) {
                if (grades.length > 0) {
                    const avg = grades.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / grades.length;
                    avgGradeEl.innerText = Math.round(avg) + '%';
                } else {
                    avgGradeEl.innerText = '0%';
                }
            }

            // Pending Alerts (Students with score < 50%)
            if (pendingAlertsEl) {
                const failingCount = grades.filter(g => (g.percentage || 0) < 50).length;
                pendingAlertsEl.innerText = failingCount;
            }

            // Load last quizzes into table
            renderDashboardQuizzesTable(quizzesRes.data || []);
        } else if (role === 'student' && window.location.pathname.includes('student-dashboard')) {
            // Student Stats
            const quizCountEl = document.getElementById('active-quizzes-count');
            const response = await api.getActiveQuizzes();
            if (quizCountEl) quizCountEl.innerText = `لديك ${response.count || 0} اختبار جديد`;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

function renderDashboardQuizzesTable(quizzes) {
    const tableBody = document.getElementById('dashboard-quizzes-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    if (quizzes.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">لا توجد اختبارات منشأة حالياً</td></tr>';
        return;
    }

    // Sort by date descending
    const sortedQuizzes = [...quizzes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    sortedQuizzes.slice(0, 5).forEach(quiz => {
        const isActive = new Date(quiz.endDate) > new Date();
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${quiz.title}</td>
            <td>${quiz.group ? quiz.group.name : 'عام'}</td>
            <td>${new Date(quiz.createdAt).toLocaleDateString('ar-EG')}</td>
            <td><span class="badge ${isActive ? 'bg-success' : 'bg-secondary'}">${isActive ? 'نشط' : 'منتهي'}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-secondary edit-quiz-btn" data-id="${quiz._id}" title="تعديل"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-outline-danger delete-quiz-btn" data-id="${quiz._id}" title="حذف"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tableBody.appendChild(tr);
    });

    // Edit Event
    tableBody.querySelectorAll('.edit-quiz-btn').forEach(btn => {
        btn.onclick = () => {
            window.location.href = `pages/teacher/quiz-creator.html?id=${btn.dataset.id}`;
        };
    });

    tableBody.querySelectorAll('.delete-quiz-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (confirm('هل أنت متأكد من حذف هذا الاختبار؟')) {
                try {
                    await api.deleteQuiz(btn.dataset.id);
                    showNotification('تم حذف الاختبار');
                    btn.closest('tr').remove();
                } catch (error) {
                    showNotification('خطأ في الحذف', 'error');
                }
            }
        });
    });
}

// --- Group Management Logic ---
async function initGroupManagement() {
    const groupsContainer = document.getElementById('groups-container');
    const searchInput = document.getElementById('search-groups');
    const saveGroupBtn = document.getElementById('save-group-btn');
    const groupForm = document.getElementById('add-group-form');

    if (!groupsContainer) return;

    let allGroups = [];

    const fetchAndRender = async () => {
        try {
            const response = await api.getAllGroups();
            allGroups = response.data || [];
            renderGroups(allGroups);
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    fetchAndRender();

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = allGroups.filter(g => 
                g.name.toLowerCase().includes(term) || 
                (g.course && g.course.toLowerCase().includes(term))
            );
            renderGroups(filtered);
        });
    }

    if (saveGroupBtn && groupForm) {
        saveGroupBtn.addEventListener('click', async () => {
            const name = document.getElementById('groupName').value;
            const course = document.getElementById('courseName').value;
            const grade = document.getElementById('groupGrade').value;
            const studentsCount = document.getElementById('studentCount').value;

            if (!name || !grade) {
                showNotification('يرجى ملء الحقول المطلوبة', 'error');
                return;
            }

            try {
                const groupData = { 
                    name, 
                    description: course, 
                    grade, 
                    teacher: getUserId() 
                };
                await api.createGroup(groupData);
                showNotification(`تم إنشاء مجموعة "${name}" بنجاح`);
                groupForm.reset();
                bootstrap.Modal.getInstance(document.getElementById('addGroupModal')).hide();
                fetchAndRender();
            } catch (error) {
                showNotification('خطأ: ' + error.message, 'error');
            }
        });
    }
}

function renderGroups(groups) {
    const container = document.getElementById('groups-container');
    if (!container) return;

    container.innerHTML = '';
    groups.forEach(group => {
        const col = document.createElement('div');
        col.className = 'col-md-4 fade-in';
        col.innerHTML = `
            <div class="card border p-3 h-100 shadow-sm">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <span class="badge bg-light text-primary p-2">الصف ${group.grade}</span>
                    <div class="dropdown">
                        <button class="btn btn-link text-muted p-0" data-bs-toggle="dropdown"><i class="fas fa-ellipsis-v"></i></button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item text-danger delete-group" href="#" data-id="${group._id}">حذف</a></li>
                        </ul>
                    </div>
                </div>
                <h5 class="fw-bold">${group.name}</h5>
                <p class="text-muted small">${group.description || ''}</p>
                <div class="d-flex justify-content-between align-items-center mt-auto">
                    <span class="small text-muted"><i class="fas fa-users me-1"></i> ${group.students ? group.students.length : 0} طالب</span>
                    <button class="btn btn-sm btn-outline-primary view-students-btn" data-id="${group._id}" data-name="${group.name}" data-grade="${group.grade}">عرض الطلاب</button>
                </div>
            </div>
        `;
        container.appendChild(col);
    });

    container.querySelectorAll('.view-students-btn').forEach(btn => {
        btn.onclick = async () => {
            const groupId = btn.dataset.id;
            const groupName = btn.dataset.name;
            const groupGrade = btn.dataset.grade;
            
            document.getElementById('viewStudentsModalLabel').innerText = `طلاب مجموعة: ${groupName}`;
            const modal = new bootstrap.Modal(document.getElementById('viewStudentsModal'));
            modal.show();

            const loadStudents = async () => {
                try {
                    const response = await api.getGroup(groupId);
                    const group = response.data;
                    const tbody = document.getElementById('group-students-body');
                    tbody.innerHTML = '';
                    
                    if (!group.students || group.students.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="4" class="text-center">لا يوجد طلاب في هذه المجموعة</td></tr>';
                    } else {
                        group.students.forEach(s => {
                            const tr = document.createElement('tr');
                            tr.innerHTML = `
                                <td>${s.name}</td>
                                <td>${s.studentId}</td>
                                <td>${s.email}</td>
                                <td><button class="btn btn-sm btn-outline-danger border-0 remove-student-btn" data-sid="${s._id}"><i class="fas fa-trash"></i></button></td>
                            `;
                            tbody.appendChild(tr);
                        });
                    }
                } catch (e) { console.error(e); }
            };

            await loadStudents();

            document.getElementById('save-student-btn').onclick = async () => {
                const name = document.getElementById('new-student-name').value;
                const studentId = document.getElementById('new-student-id').value;
                const email = document.getElementById('new-student-email').value;
                const age = document.getElementById('new-student-age').value;

                if (!name || !studentId || !email) {
                    showNotification('يرجى ملء البيانات المطلوبة', 'error');
                    return;
                }

                try {
                    // 1. Create student
                    const sResponse = await api.createStudent({ name, studentId, email, age, grade: groupGrade, password: '123456' });
                    // 2. Add to group
                    await api.addStudentToGroup(groupId, sResponse.data._id);
                    showNotification('تم إضافة الطالب بنجاح');
                    document.getElementById('add-student-to-group-form').reset();
                    await loadStudents();
                } catch (error) {
                    showNotification(error.message, 'error');
                }
            };
        };
    });

    container.querySelectorAll('.delete-group').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (confirm('هل أنت متأكد من حذف هذه المجموعة؟')) {
                try {
                    await api.deleteGroup(btn.dataset.id);
                    showNotification('تم حذف المجموعة');
                    initGroupManagement(); // Refresh
                } catch (error) {
                    showNotification('خطأ في الحذف', 'error');
                }
            }
        });
    });
}

// --- Quiz Creator Logic ---
async function initStudentQuizzes() {
    const container = document.getElementById('student-quizzes-container');
    if (!container) return;

    const studentId = localStorage.getItem('mualimi_student_id');

    try {
        const [quizzesRes, gradesRes] = await Promise.all([
            api.getActiveQuizzes(),
            studentId ? api.getStudentGrades(studentId) : Promise.resolve({ data: [] })
        ]);

        const quizzes = quizzesRes.data || [];
        const studentGrades = gradesRes.data || [];
        
        container.innerHTML = '';
        
        if (quizzes.length === 0) {
            container.innerHTML = '<div class="text-center py-5"><p class="text-muted">لا توجد اختبارات حالياً</p></div>';
            return;
        }

        quizzes.forEach(quiz => {
            const hasTaken = studentGrades.some(g => g.quiz && g.quiz._id === quiz._id);
            const div = document.createElement('div');
            div.className = 'quiz-card fade-in';
            div.innerHTML = `
                <div>
                    <h6 class="fw-bold mb-1">${quiz.title}</h6>
                    <p class="small text-muted mb-0"><i class="fas fa-layer-group me-1"></i> ${quiz.group ? quiz.group.name : 'عام'}</p>
                </div>
                ${hasTaken ? 
                    `<button class="btn btn-success btn-sm rounded-pill px-4" disabled>تم الحل <i class="fas fa-check-circle ms-1"></i></button>` :
                    `<button class="btn btn-primary btn-sm rounded-pill px-4 start-quiz" data-id="${quiz._id}">ابدأ</button>`
                }
            `;
            container.appendChild(div);
        });

        container.querySelectorAll('.start-quiz').forEach(btn => {
            btn.addEventListener('click', () => {
                const quizId = btn.dataset.id;
                // If student is already logged in, skip modal
                const loggedInStudentId = localStorage.getItem('mualimi_student_id');
                if (loggedInStudentId) {
                    window.location.href = `take-quiz.html?id=${quizId}`;
                    return;
                }

                const modal = new bootstrap.Modal(document.getElementById('studentLoginModal'));
                modal.show();
                
                const verifyBtn = document.getElementById('verify-student-btn');
                verifyBtn.onclick = async () => {
                    const name = document.getElementById('verify-name').value;
                    const studentId = document.getElementById('verify-id').value;
                    const email = document.getElementById('verify-email').value;
                    const age = document.getElementById('verify-age').value;
                    const password = document.getElementById('verify-password')?.value || '123456'; // Default if not in modal

                    if (!name || !studentId) {
                        showNotification('يرجى إدخال كافة البيانات', 'error');
                        return;
                    }

                    try {
                        // 1. Try to login/verify first
                        let student;
                        try {
                            const vResponse = await api.request('/auth/student/login', {
                                method: 'POST',
                                body: JSON.stringify({ studentId, password })
                            });
                            student = vResponse.data;
                        } catch (e) {
                            // 2. If login fails (not found), register them
                            if (email && age) {
                                const quizRes = await api.getQuiz(quizId);
                                const regResponse = await api.request('/auth/student/signup', {
                                    method: 'POST',
                                    body: JSON.stringify({ 
                                        name, studentId, email, age, password,
                                        grade: quizRes.data.group ? quizRes.data.group.grade : '1' 
                                    })
                                });
                                student = regResponse.data;
                                // Add to group if quiz has one
                                if (quizRes.data.group) {
                                    await api.addStudentToGroup(quizRes.data.group._id, student._id);
                                }
                                showNotification('تم تسجيل بياناتك بنجاح');
                            } else {
                                throw new Error('الطالب غير مسجل، يرجى إكمال كافة البيانات للتسجيل');
                            }
                        }

                        if (student) {
                            localStorage.setItem('mualimi_role', 'student');
                            localStorage.setItem('mualimi_student_id', student._id);
                            localStorage.setItem('mualimi_student_name', student.name);
                            window.location.href = `take-quiz.html?id=${quizId}`;
                        }
                    } catch (error) {
                        showNotification(error.message, 'error');
                    }
                };
            });
        });
    } catch (e) {}
}
async function initStudentDashboard() {
    const studentName = localStorage.getItem('mualimi_student_name') || 'طالب';
    const headerName = document.querySelector('.student-header h4');
    if (headerName) headerName.textContent = `مرحباً، ${studentName}`;
    
    const studentId = localStorage.getItem('mualimi_student_id');
    const quizCountEl = document.getElementById('active-quizzes-count');

    if (quizCountEl) {
        try {
            const [quizzesRes, gradesRes] = await Promise.all([
                api.getActiveQuizzes(),
                studentId ? api.getStudentGrades(studentId) : Promise.resolve({ data: [] })
            ]);

            const quizzes = quizzesRes.data || [];
            const grades = gradesRes.data || [];
            
            // Count quizzes that haven't been taken yet
            const untakenCount = quizzes.filter(q => !grades.some(g => g.quiz && g.quiz._id === q._id)).length;
            
            quizCountEl.innerText = `لديك ${untakenCount} اختبار جديد`;
        } catch (e) {
            console.error('Dashboard Stats Error:', e);
        }
    }
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', async () => {
    // Health check
    try {
        await api.checkHealth();
    } catch (e) {
        showNotification('الخادم غير متصل. تأكد من تشغيل backend.', 'error');
    }

    // Sidebar Toggle
    const toggleBtn = document.querySelector('.mobile-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (toggleBtn && sidebar) {
        toggleBtn.onclick = () => {
            sidebar.classList.toggle('active');
            const icon = toggleBtn.querySelector('i');
            icon.className = sidebar.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
        };
    }

    // Sync Stats
    loadDashboardStats();
    
    // Init Modules
    initGroupManagement();
    initStudentQuizzes();
    initStudentDashboard();
});
