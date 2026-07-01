// Quiz Engine

const Quiz = {
    currentCategory: null,
    currentQuestions: [],
    currentAnswers: {},
    currentQuestionIndex: 0,

    init() {
        this.renderCategorySelection();
        this.setupEventListeners();
    },

    renderCategorySelection() {
        const questions = Storage.getQuestions();
        const container = document.getElementById('categoryButtons');

        if (Object.keys(questions).length === 0) {
            container.innerHTML = '<p>No quiz categories available.</p>';
            return;
        }

        container.innerHTML = Object.keys(questions).map(category => `
            <button class="category-btn" onclick="Quiz.startQuiz('${category}')" type="button" aria-label="Start ${category} quiz">
                ${category}
            </button>
        `).join('');

        // Render quiz resources section below category buttons
        this.renderQuizResourcesSection();
    },

    renderQuizResourcesSection() {
        const resources = [
            {
                name: 'LeetCode',
                url: 'https://leetcode.com/',
                categories: 'Programming & Data Structures',
                description: 'Big tech style coding problems, contests, and interview preparation.'
            },
            {
                name: 'HackerRank',
                url: 'https://www.hackerrank.com/',
                categories: 'Programming, Algorithms, SQL',
                description: 'Practice coding, algorithms, and database queries with curated challenges.'
            },
            {
                name: 'GeeksforGeeks Practice',
                url: 'https://practice.geeksforgeeks.org/',
                categories: 'DSA, CS Fundamentals',
                description: 'Extensive problem sets on data structures, algorithms, and core CS topics.'
            },
            {
                name: 'Codeforces',
                url: 'https://codeforces.com/',
                categories: 'Competitive Programming',
                description: 'Regular contests and competitive programming problems to build speed and accuracy.'
            },
            {
                name: 'Codewars',
                url: 'https://www.codewars.com/',
                categories: 'Competitive Programming',
                description: 'Improve your development skills by training with your peers on code kata that continuously challenge and push your coding practice.'
            },
            {
                name: 'Codeingame',
                url: 'https://www.codingame.com/start/',
                categories: 'Vibe learning',
                description: 'Level up your coding with games, puzzles, and challenges.'
            },
            {
                name: 'IndiaBix Aptitude',
                url: 'https://www.indiabix.com/aptitude/questions-and-answers/',
                categories: 'Aptitude & Placement Tests',
                description: 'Aptitude, reasoning, and verbal questions commonly asked in campus placements.'
            },
            {
                name: 'InterviewBit',
                url: 'https://www.interviewbit.com/practice/',
                categories: 'Programming & System Design',
                description: 'Structured tracks for coding interviews and system design preparation.'
            }
        ];

        const quizResourcesHtml = `
        <div class="learning-quiz-resources" style="margin-top: 3rem;">
            <h3 class="learning-quiz-title">Recommended Quiz & Practice Websites</h3>
            <p class="learning-quiz-subtitle">
                Use these platforms to practice aptitude, coding, and computer science quizzes alongside the topics below.
            </p>
            <div class="quiz-resources-grid">
                ${resources.map(r => `
                    <div class="quiz-resource-card">
                        <h4>${r.name}</h4>
                        <p class="quiz-resource-categories">${r.categories}</p>
                        <p class="quiz-resource-description">${r.description}</p>
                        <a href="${r.url}" target="_blank" rel="noopener noreferrer" class="quiz-resource-link">
                            Visit Site
                        </a>
                    </div>
                `).join('')}
            </div>
        </div>
        `;

        // Insert after category buttons
        const quizSelection = document.getElementById('quizSelection');
        if (quizSelection) {
            // Check if resources section already exists
            const existingResources = quizSelection.querySelector('.learning-quiz-resources');
            if (existingResources) {
                existingResources.remove();
            }
            quizSelection.insertAdjacentHTML('beforeend', quizResourcesHtml);
        }
    },

    setupEventListeners() {
        document.getElementById('prevQuestion').addEventListener('click', () => {
            this.navigateQuestion(-1);
        });

        document.getElementById('nextQuestion').addEventListener('click', () => {
            this.navigateQuestion(1);
        });

        document.getElementById('submitQuiz').addEventListener('click', () => {
            this.submitQuiz();
        });

        // Add back button listener
        const backButton = document.getElementById('backToQuizSelection');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.cancelQuiz();
            });
        }
    },

    startQuiz(category) {
        const questions = Storage.getQuestions();
        this.currentCategory = category;
        this.currentQuestions = questions[category] || [];
        this.currentAnswers = {};
        this.currentQuestionIndex = 0;

        if (this.currentQuestions.length === 0) {
            alert('No questions available for this category.');
            return;
        }

        // Hide selection, show quiz
        document.getElementById('quizSelection').classList.add('hidden');
        document.getElementById('quizContainer').classList.remove('hidden');
        document.getElementById('quizResults').classList.add('hidden');

        this.renderQuestion();
    },

    renderQuestion() {
        const question = this.currentQuestions[this.currentQuestionIndex];
        const container = document.getElementById('quizQuestion');

        document.getElementById('quizCategoryName').textContent = this.currentCategory;
        document.getElementById('currentQuestionNum').textContent = this.currentQuestionIndex + 1;
        document.getElementById('totalQuestions').textContent = this.currentQuestions.length;

        container.innerHTML = `
            <div class="question-text">${question.question}</div>
            <div class="options-list">
                ${question.options.map((option, index) => `
                    <div class="option-item ${this.currentAnswers[this.currentQuestionIndex] === index ? 'selected' : ''}" 
                         onclick="Quiz.selectAnswer(${index})"
                         role="button"
                         tabindex="0"
                         onkeypress="if(event.key==='Enter'||event.key===' ') {event.preventDefault(); Quiz.selectAnswer(${index});}">
                        <input type="radio" 
                               name="question-${this.currentQuestionIndex}" 
                               value="${index}"
                               ${this.currentAnswers[this.currentQuestionIndex] === index ? 'checked' : ''}
                               aria-label="Option ${index + 1}: ${option}">
                        <label>${option}</label>
                    </div>
                `).join('')}
            </div>
        `;

        // Update navigation buttons
        const prevBtn = document.getElementById('prevQuestion');
        const nextBtn = document.getElementById('nextQuestion');
        const submitBtn = document.getElementById('submitQuiz');
        
        if (prevBtn) prevBtn.disabled = this.currentQuestionIndex === 0;
        const isLastQuestion = this.currentQuestionIndex === this.currentQuestions.length - 1;
        if (nextBtn) nextBtn.classList.toggle('hidden', isLastQuestion);
        if (submitBtn) submitBtn.classList.toggle('hidden', !isLastQuestion);
    },

    selectAnswer(answerIndex) {
        this.currentAnswers[this.currentQuestionIndex] = answerIndex;
        this.renderQuestion(); // Re-render to show selection
    },

    navigateQuestion(direction) {
        const newIndex = this.currentQuestionIndex + direction;
        if (newIndex >= 0 && newIndex < this.currentQuestions.length) {
            this.currentQuestionIndex = newIndex;
            this.renderQuestion();
        }
    },

    submitQuiz() {
        // Calculate score
        let correct = 0;
        const results = [];

        this.currentQuestions.forEach((question, index) => {
            const userAnswer = this.currentAnswers[index];
            const isCorrect = userAnswer === question.correct;
            
            if (isCorrect) correct++;

            results.push({
                question: question.question,
                userAnswer: userAnswer !== undefined ? question.options[userAnswer] : 'Not answered',
                correctAnswer: question.options[question.correct],
                isCorrect: isCorrect,
                explanation: question.explanation
            });
        });

        const score = Math.round((correct / this.currentQuestions.length) * 100);
        const accuracy = Math.round((correct / this.currentQuestions.length) * 100);

        // Save quiz attempt
        const attempt = {
            date: new Date().toISOString(),
            category: this.currentCategory,
            score: score,
            correct: correct,
            total: this.currentQuestions.length,
            accuracy: accuracy
        };

        Storage.saveQuizAttempt(attempt);

        // Show results
        this.showResults(score, correct, this.currentQuestions.length, results);

        // Reset quiz state
        this.currentCategory = null;
        this.currentQuestions = [];
        this.currentAnswers = {};
        this.currentQuestionIndex = 0;

        // Update dashboard
        Dashboard.update();
    },

    showResults(score, correct, total, results) {
        const container = document.getElementById('quizResults');
        const incorrect = total - correct;

        container.innerHTML = `
            <div class="result-summary">
                <h3>Quiz Results</h3>
                <div class="result-score">${score}%</div>
                <div class="result-details">
                    <div class="result-stat">
                        <strong>${correct}</strong>
                        <p>Correct</p>
                    </div>
                    <div class="result-stat">
                        <strong>${incorrect}</strong>
                        <p>Incorrect</p>
                    </div>
                    <div class="result-stat">
                        <strong>${total}</strong>
                        <p>Total Questions</p>
                    </div>
                </div>
            </div>
            <div class="explanations-section">
                <h4>Question Explanations</h4>
                ${results.map((result, index) => `
                    <div class="explanation-item">
                        <div class="explanation-question">
                            Q${index + 1}: ${result.question}
                        </div>
                        <div class="explanation-answer">
                            Your Answer: ${result.userAnswer} 
                            ${result.isCorrect ? '✓' : '✗'}
                        </div>
                        <div class="explanation-answer">
                            Correct Answer: ${result.correctAnswer}
                        </div>
                        <div class="explanation-text">
                            ${result.explanation}
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="btn-primary" onclick="Quiz.backToSelection()" type="button" style="margin-top: 2rem; width: 100%;">
                Take Another Quiz
            </button>
        `;

        document.getElementById('quizContainer').classList.add('hidden');
        document.getElementById('quizResults').classList.remove('hidden');
    },

    backToSelection() {
        document.getElementById('quizSelection').classList.remove('hidden');
        document.getElementById('quizContainer').classList.add('hidden');
        document.getElementById('quizResults').classList.add('hidden');
    },

    cancelQuiz() {
        if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
            this.currentCategory = null;
            this.currentQuestions = [];
            this.currentAnswers = {};
            this.currentQuestionIndex = 0;
            this.backToSelection();
        }
    },

    getQuizStats() {
        const attempts = Storage.getQuizAttempts();
        
        if (attempts.length === 0) {
            return {
                totalAttempts: 0,
                averageScore: 0
            };
        }

        const totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
        const averageScore = Math.round(totalScore / attempts.length);

        return {
            totalAttempts: attempts.length,
            averageScore: averageScore
        };
    }
};



