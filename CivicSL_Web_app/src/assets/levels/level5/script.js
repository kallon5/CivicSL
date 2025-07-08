// Level 5 Assessment Script
const questions = [
    {
        question: "What is the primary purpose of civic education?",
        options: [
            "To prepare citizens for active participation in democracy",
            "To teach only about government structures",
            "To focus solely on voting rights",
            "To memorize historical dates"
        ],
        correct: 0
    },
    {
        question: "Which branch of government is responsible for interpreting laws?",
        options: [
            "Executive Branch",
            "Legislative Branch",
            "Judicial Branch",
            "Administrative Branch"
        ],
        correct: 2
    },
    {
        question: "What is the fundamental principle behind the separation of powers?",
        options: [
            "To make government more efficient",
            "To prevent any one branch from becoming too powerful",
            "To reduce government spending",
            "To simplify the lawmaking process"
        ],
        correct: 1
    },
    {
        question: "Which of the following is NOT a civic responsibility?",
        options: [
            "Voting in elections",
            "Paying taxes",
            "Serving on a jury when called",
            "Running for office (mandatory)"
        ],
        correct: 3
    },
    {
        question: "What does the First Amendment protect?",
        options: [
            "Freedom of speech, religion, press, assembly, and petition",
            "Right to bear arms",
            "Right to a speedy trial",
            "Right to vote"
        ],
        correct: 0
    },
    {
        question: "What is the purpose of checks and balances in government?",
        options: [
            "To slow down the legislative process",
            "To ensure each branch can limit the power of other branches",
            "To increase government bureaucracy",
            "To reduce public participation"
        ],
        correct: 1
    },
    {
        question: "Which level of government is typically responsible for education?",
        options: [
            "Federal government only",
            "State and local governments",
            "International organizations",
            "Private corporations only"
        ],
        correct: 1
    },
    {
        question: "What is civic engagement?",
        options: [
            "Only voting in elections",
            "Active participation in community and political life",
            "Reading the news",
            "Paying taxes"
        ],
        correct: 1
    },
    {
        question: "What is the role of the media in a democracy?",
        options: [
            "To entertain the public",
            "To inform citizens and hold government accountable",
            "To support only one political party",
            "To avoid controversial topics"
        ],
        correct: 1
    },
    {
        question: "What is the purpose of public opinion in a democracy?",
        options: [
            "To create division among citizens",
            "To influence government decisions and policies",
            "To replace the voting process",
            "To eliminate political parties"
        ],
        correct: 1
    },
    {
        question: "What is the significance of the rule of law?",
        options: [
            "It applies only to citizens, not government officials",
            "Everyone, including government officials, must follow the law",
            "It only applies to criminal cases",
            "It can be ignored in emergencies"
        ],
        correct: 1
    },
    {
        question: "What is the purpose of political parties?",
        options: [
            "To divide the country",
            "To organize citizens with similar political views and goals",
            "To eliminate competition in elections",
            "To control the media"
        ],
        correct: 1
    },
    {
        question: "What is the importance of an independent judiciary?",
        options: [
            "To support the executive branch",
            "To make decisions based on law, not political pressure",
            "To speed up court cases",
            "To reduce court costs"
        ],
        correct: 1
    },
    {
        question: "What is the role of interest groups in democracy?",
        options: [
            "To replace political parties",
            "To advocate for specific issues and influence policy",
            "To eliminate public debate",
            "To control elections"
        ],
        correct: 1
    },
    {
        question: "What is the purpose of the electoral college?",
        options: [
            "To make elections more complicated",
            "To balance the influence of large and small states in presidential elections",
            "To eliminate popular vote",
            "To reduce voter participation"
        ],
        correct: 1
    },
    {
        question: "What is the significance of civil rights?",
        options: [
            "They only apply to certain groups",
            "They protect individual freedoms from government interference",
            "They are optional for governments to follow",
            "They only apply to voting"
        ],
        correct: 1
    },
    {
        question: "What is the purpose of federalism?",
        options: [
            "To centralize all power in the federal government",
            "To divide power between national and state governments",
            "To eliminate state governments",
            "To create international government"
        ],
        correct: 1
    },
    {
        question: "What is the importance of public service?",
        options: [
            "It's only for government employees",
            "It strengthens communities and democracy through citizen participation",
            "It's mandatory for all citizens",
            "It only involves volunteering"
        ],
        correct: 1
    },
    {
        question: "What is the role of education in democracy?",
        options: [
            "To prepare only for jobs",
            "To prepare informed and engaged citizens",
            "To eliminate critical thinking",
            "To support only one viewpoint"
        ],
        correct: 1
    },
    {
        question: "What is the purpose of constitutional rights?",
        options: [
            "To limit individual freedoms",
            "To protect fundamental freedoms and limit government power",
            "To apply only to certain citizens",
            "To create government bureaucracy"
        ],
        correct: 1
    }
];

let currentQuestion = 0;
let userAnswers = new Array(questions.length).fill(null);
let startTime;
let timeLimit = 7 * 60; // 7 minutes in seconds

// DOM elements
const assessmentIntro = document.querySelector('.assessment-intro');
const quizSection = document.querySelector('.quiz-section');
const resultsSection = document.querySelector('.results-section');
const reflectionTextarea = document.getElementById('reflection');
const questionContainer = document.getElementById('question-container');
const questionCounter = document.getElementById('question-counter');
const progressFill = document.getElementById('progress-fill');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const retryBtn = document.getElementById('retry-btn');
const scoreDisplay = document.getElementById('score-display');
const feedback = document.getElementById('feedback');
const skipReflectionBtn = document.getElementById('skip-reflection-btn');
const startWithReflectionBtn = document.getElementById('start-with-reflection-btn');

// Start assessment (skip reflection)
function startAssessment() {
    assessmentIntro.style.display = 'none';
    quizSection.style.display = 'block';
    startTime = Date.now();
    loadQuestion();
    updateTimer();
}

// Start assessment with reflection
function startAssessmentWithReflection() {
    const reflection = reflectionTextarea.value.trim();
    if (reflection.length === 0) {
        alert('Please enter a reflection or click "Skip Reflection" to proceed without one.');
        return;
    }
    
    assessmentIntro.style.display = 'none';
    quizSection.style.display = 'block';
    startTime = Date.now();
    loadQuestion();
    updateTimer();
}

// Load question
function loadQuestion() {
    const question = questions[currentQuestion];
    questionCounter.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    progressFill.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
    
    questionContainer.innerHTML = `
        <div class="question">
            <h3>${question.question}</h3>
            <div class="options">
                ${question.options.map((option, index) => `
                    <div class="option ${userAnswers[currentQuestion] === index ? 'selected' : ''}" onclick="selectOption(${index})">
                        <input type="radio" name="q${currentQuestion}" value="${index}" ${userAnswers[currentQuestion] === index ? 'checked' : ''}>
                        <label>${option}</label>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    updateNavigation();
}

// Select option
function selectOption(index) {
    userAnswers[currentQuestion] = index;
    loadQuestion();
}

// Update navigation buttons
function updateNavigation() {
    prevBtn.disabled = currentQuestion === 0;
    nextBtn.style.display = currentQuestion === questions.length - 1 ? 'none' : 'block';
    submitBtn.style.display = currentQuestion === questions.length - 1 ? 'block' : 'none';
}

// Navigation
prevBtn.addEventListener('click', () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion();
    }
});

// Submit assessment
submitBtn.addEventListener('click', () => {
    const unanswered = userAnswers.filter(answer => answer === null).length;
    if (unanswered > 0) {
        if (!confirm(`You have ${unanswered} unanswered questions. Are you sure you want to submit?`)) {
            return;
        }
    }
    showResults();
});

// Show results
function showResults() {
    const endTime = Date.now();
    const timeUsed = Math.floor((endTime - startTime) / 1000);
    
    let correct = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === questions[index].correct) {
            correct++;
        }
    });
    
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= 80;
    
    quizSection.style.display = 'none';
    resultsSection.style.display = 'block';
    
    // Add animation class for score display
    scoreDisplay.className = 'score-display-animated';
    
    scoreDisplay.innerHTML = `
        <div class="score-header">
            <h3>${passed ? '🎉 Congratulations!' : '📚 Keep Learning!'}</h3>
        </div>
        <div class="score-details">
            <div class="score-circle ${passed ? 'passed' : 'failed'}">
                <span class="score-number">${score}%</span>
                <span class="score-label">${passed ? 'PASSED' : 'FAILED'}</span>
            </div>
            <div class="score-breakdown">
                <p><strong>Correct Answers:</strong> ${correct}/${questions.length}</p>
                <p><strong>Time Used:</strong> ${Math.floor(timeUsed / 60)}:${(timeUsed % 60).toString().padStart(2, '0')}</p>
                <p><strong>Passing Score:</strong> 80%</p>
            </div>
        </div>
    `;
    
    feedback.innerHTML = `
        <div class="feedback-content">
            <h3>${passed ? '🏆 Assessment Complete!' : '📖 Areas for Improvement'}</h3>
            <p>${passed ? 
                'You have successfully demonstrated comprehensive understanding of civic concepts. You are now ready to apply this knowledge in your community!' :
                'Review the concepts covered in previous levels and try again. Focus on understanding the fundamental principles of democracy and civic engagement.'
            }</p>
            ${passed ? '<div class="success-animation">🎊 Certificate Unlocked! 🎊</div>' : ''}
        </div>
    `;
    
    // Send results to parent window if in iframe
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({
            type: 'assessmentComplete',
            score: score,
            correctAnswers: correct,
            totalQuestions: questions.length,
            timeUsed: timeUsed,
            passed: passed,
            reflection: reflectionTextarea.value.trim()
        }, '*');
    }
}

// Retry assessment
retryBtn.addEventListener('click', () => {
    currentQuestion = 0;
    userAnswers = new Array(questions.length).fill(null);
    resultsSection.style.display = 'none';
    assessmentIntro.style.display = 'block';
    reflectionTextarea.value = '';
});

// Timer
function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const remaining = timeLimit - elapsed;
    
    if (remaining <= 0) {
        showResults();
        return;
    }
    
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    
    // Update timer display if it exists
    const timerDisplay = document.getElementById('timer');
    if (timerDisplay) {
        timerDisplay.textContent = `Time Remaining: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    setTimeout(updateTimer, 1000);
}

// Event listeners for reflection buttons
document.addEventListener('DOMContentLoaded', () => {
    skipReflectionBtn.addEventListener('click', startAssessment);
    startWithReflectionBtn.addEventListener('click', startAssessmentWithReflection);
}); 