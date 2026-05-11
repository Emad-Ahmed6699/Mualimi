// Quiz Module - Handles all quiz-related logic
const QuizModule = (() => {
    let questionCount = 0;

    const addQuestion = (container) => {
        questionCount++;
        const qDiv = document.createElement('div');
        qDiv.className = 'card border p-3 mb-3 bg-light question-item fade-in';
        qDiv.innerHTML = `
            <div class="d-flex justify-content-between mb-3">
                <h6 class="fw-bold">سؤال ${questionCount}</h6>
                <button type="button" class="btn btn-sm btn-outline-danger delete-question"><i class="fas fa-trash"></i></button>
            </div>
            <textarea class="form-control mb-3 q-text" placeholder="اكتب السؤال هنا..."></textarea>
            <div class="row g-2 options-row">
                <div class="col-6 d-flex align-items-center">
                    <input type="radio" name="correct-${questionCount}" class="form-check-input me-2" value="0" checked>
                    <input type="text" class="form-control form-control-sm opt-val" placeholder="الخيار 1">
                </div>
                <div class="col-6 d-flex align-items-center">
                    <input type="radio" name="correct-${questionCount}" class="form-check-input me-2" value="1">
                    <input type="text" class="form-control form-control-sm opt-val" placeholder="الخيار 2">
                </div>
                <div class="col-6 d-flex align-items-center">
                    <input type="radio" name="correct-${questionCount}" class="form-check-input me-2" value="2">
                    <input type="text" class="form-control form-control-sm opt-val" placeholder="الخيار 3">
                </div>
                <div class="col-6 d-flex align-items-center">
                    <input type="radio" name="correct-${questionCount}" class="form-check-input me-2" value="3">
                    <input type="text" class="form-control form-control-sm opt-val" placeholder="الخيار 4">
                </div>
            </div>
            <small class="text-muted mt-2 d-block">حدد الدائرة بجانب الإجابة الصحيحة</small>
        `;
        container.appendChild(qDiv);
        
        // Add delete event listener
        qDiv.querySelector('.delete-question').addEventListener('click', function() {
            qDiv.remove();
        });
    };

    const collectQuestions = () => {
        const questions = [];
        let totalPoints = 0;

        document.querySelectorAll('.question-item').forEach(qItem => {
            const qText = qItem.querySelector('.q-text').value.trim();
            const options = Array.from(qItem.querySelectorAll('.opt-val')).map(opt => opt.value.trim());
            const selectedRadio = qItem.querySelector('input[type="radio"]:checked');
            const correctIdx = selectedRadio ? parseInt(selectedRadio.value) : 0;
            
            if (qText && options.every(o => o)) {
                questions.push({
                    question: qText,
                    options: options,
                    correctAnswer: options[correctIdx],
                    points: 10
                });
                totalPoints += 10;
            }
        });

        return { questions, totalPoints };
    };

    const resetQuestionCount = () => {
        questionCount = 0;
    };

    return {
        addQuestion,
        collectQuestions,
        resetQuestionCount
    };
})();
