// API Client for Mualimi
const API_BASE_URL = 'http://localhost:5000/api';

class MualimAPI {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Helper function for API calls
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                ...options,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'API request failed');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async checkHealth() {
        return this.request('/health');
    }

    // ============= STUDENTS =============
    async getAllStudents() {
        return this.request('/students');
    }

    async getStudent(id) {
        return this.request(`/students/${id}`);
    }

    async createStudent(data) {
        return this.request('/students', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateStudent(id, data) {
        return this.request(`/students/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteStudent(id) {
        return this.request(`/students/${id}`, {
            method: 'DELETE',
        });
    }

    async verifyStudent(data) {
        return this.request('/students/verify', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // ============= TEACHERS =============
    async getAllTeachers() {
        return this.request('/teachers');
    }

    async getTeacher(id) {
        return this.request(`/teachers/${id}`);
    }

    async createTeacher(data) {
        return this.request('/teachers', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateTeacher(id, data) {
        return this.request(`/teachers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteTeacher(id) {
        return this.request(`/teachers/${id}`, {
            method: 'DELETE',
        });
    }

    // ============= GROUPS =============
    async getAllGroups() {
        return this.request('/groups');
    }

    async getGroup(id) {
        return this.request(`/groups/${id}`);
    }

    async createGroup(data) {
        return this.request('/groups', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateGroup(id, data) {
        return this.request(`/groups/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async addStudentToGroup(groupId, studentId) {
        return this.request(`/groups/${groupId}/add-student`, {
            method: 'POST',
            body: JSON.stringify({ studentId }),
        });
    }

    async deleteGroup(id) {
        return this.request(`/groups/${id}`, {
            method: 'DELETE',
        });
    }

    // ============= QUIZZES =============
    async getAllQuizzes() {
        return this.request('/quizzes');
    }

    async getActiveQuizzes() {
        return this.request('/quizzes/active/list');
    }

    async getQuiz(id) {
        return this.request(`/quizzes/${id}`);
    }

    async createQuiz(data) {
        return this.request('/quizzes', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateQuiz(id, data) {
        return this.request(`/quizzes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async submitQuiz(quizId, data) {
        return this.request(`/quizzes/${quizId}/submit`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async deleteQuiz(id) {
        return this.request(`/quizzes/${id}`, {
            method: 'DELETE',
        });
    }

    async getStudentQuizzes(groupId) {
        return this.request(`/quizzes/student/${groupId}`);
    }

    async verifyQuizAccess(quizId, accessCode) {
        return this.request(`/quizzes/${quizId}/verify-access`, {
            method: 'POST',
            body: JSON.stringify({ accessCode }),
        });
    }


    // ============= GRADES =============
    async getAllGrades() {
        return this.request('/grades');
    }

    async getStudentGrades(studentId) {
        return this.request(`/grades/student/${studentId}`);
    }

    async getGroupGrades(groupId) {
        return this.request(`/grades/group/${groupId}`);
    }

    async createGrade(data) {
        return this.request('/grades', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateGrade(id, data) {
        return this.request(`/grades/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteGrade(id) {
        return this.request(`/grades/${id}`, {
            method: 'DELETE',
        });
    }
}

// Export for use in HTML
const api = new MualimAPI();
