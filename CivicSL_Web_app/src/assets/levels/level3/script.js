const lessons = [
  {
    id: 1,
    title: "Module 1: Types of Government",
    summary: "Define government, identify types, and understand Sierra Leone's system.",
    fullText: `Government is the system or group of people that governs an organized community, usually a state or country. Governments create and enforce laws, provide public services, and protect citizens' rights.\nCommon Types of Government:\n- Democracy: Rule by the people, often through elected representatives.\n- Monarchy: Rule by a king or queen.\n- Dictatorship: Rule by one person with absolute power.\n- Military Rule: Government controlled by military leaders.\nSierra Leone is a democratic republic with a multi-party system where leaders are elected by the people.\n\nActivity: Compare democracy and dictatorship using a two-column table.`,
    videoUrl: ""
  },
  {
    id: 2,
    title: "Module 2: The Three Arms of Government",
    summary: "Identify the three branches of government and describe their roles.",
    fullText: `Sierra Leone's government is divided into three arms or branches:\n1. Executive Branch:\n- Headed by the President\n- Enforces laws\n- Manages national affairs and foreign relations\n- Includes ministers and government departments\n2. Legislative Branch:\n- Also called Parliament\n- Makes laws\n- Approves national budget\n- Checks the power of the Executive\n- Includes Members of Parliament (MPs)\n3. Judicial Branch:\n- Interprets laws and ensures justice\n- Settles disputes\n- Protects constitutional rights\n- Includes courts and judges\n\nReal-Life Example: Parliament passed the Gender Equality and Women's Empowerment Act in 2023, and the President signed it into law. The Judiciary ensures the law is implemented fairly.\n\nActivity: Draw a triangle and label each corner with one branch of government. Write one duty next to each.`,
    videoUrl: ""
  },
  {
    id: 3,
    title: "Module 3: Separation of Powers",
    summary: "Define separation of powers and its importance in a democracy.",
    fullText: `Separation of powers means dividing government responsibilities into distinct branches to prevent any one branch from having too much power.\nWhy It Matters:\n- Prevents abuse of power\n- Encourages transparency\n- Ensures checks and balances\n- Promotes efficiency and accountability\nSierra Leone's Constitution clearly separates the powers of the Executive, Legislative, and Judicial branches. No branch can perform the core duties of another.\n\nExample: The President cannot create laws without Parliament's approval, and Parliament cannot imprison people—that is the role of the Judiciary.\n\nActivity: Write a paragraph explaining how separation of powers protects citizens' rights.`,
    videoUrl: ""
  },
  {
    id: 4,
    title: "Module 4: Checks and Balances in Government",
    summary: "Explain checks and balances and identify examples in Sierra Leone.",
    fullText: `Checks and balances allow each branch of government to limit the powers of the others. This ensures that power is balanced and fair.\nExamples:\n- The President appoints ministers, but Parliament must approve them.\n- Parliament passes laws, but the President must sign them.\n- Courts can rule a law unconstitutional if it violates citizens' rights.\n\nReal-Life Story: When a controversial law was challenged in court, the Supreme Court reviewed it and ruled that part of it violated the Constitution. The law was changed based on the ruling.\n\nActivity: Role Play: Divide into three groups representing each arm of government. Pass a law and see how each branch plays a role.`,
    videoUrl: ""
  },
  {
    id: 5,
    title: "Bonus: Your Role in Strengthening Government",
    summary: "Understand how citizens can support good governance and hold leaders accountable.",
    fullText: `Good governance depends on informed and active citizens. You can:\n- Vote in elections\n- Attend public meetings\n- Report corruption\n- Share civic knowledge\n- Ask questions about government decisions\n\nQuote: "Government of the people, by the people, for the people." – Abraham Lincoln\n\nReal-Life Youth Action: A youth group in Kambia organized a town hall to question their MP about road repairs. This is a good example of democratic participation.\n\nActivity: Create a flyer titled "How I Can Make My Government Better" and include 5 action points.`,
    videoUrl: ""
  }
];

const lessonList = document.getElementById("lesson-list");
let openedLessons = new Set();

lessons.forEach((lesson) => {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.id = lesson.id;

  const header = document.createElement("div");
  header.className = "card-header";
  header.innerHTML = `<span>${lesson.title}</span><span>▶</span>`;

  const summary = document.createElement("div");
  summary.className = "card-summary";
  summary.textContent = lesson.summary;

  const body = document.createElement("div");
  body.className = "card-body";
  body.innerHTML = `
    <iframe src="${lesson.videoUrl || ''}" frameborder="0" allowfullscreen></iframe>
    <p>${lesson.fullText}</p>
    <button onclick="alert('Download started')">📄 Download Handout</button>
  `;

  card.appendChild(header);
  card.appendChild(summary);
  card.appendChild(body);

  header.addEventListener("click", () => {
    const showing = body.style.display === "block";
    body.style.display = showing ? "none" : "block";
    header.querySelector("span:last-child").textContent = showing ? "▶" : "▼";
    openedLessons.add(lesson.id);
    if (openedLessons.size === lessons.length) {
      document.getElementById("quiz-section").style.display = "block";
    }
    if (!header.querySelector('.checkmark') && body.style.display === "block") {
      const check = document.createElement('span');
      check.textContent = '✔';
      check.className = 'checkmark';
      check.style.marginLeft = '10px';
      check.style.color = 'green';
      header.appendChild(check);
    }
  });

  lessonList.appendChild(card);
});

// Quiz Modal Logic
if(document.getElementById("takeQuizBtn")) {
  document.getElementById("takeQuizBtn").onclick = () => {
    document.getElementById("quizModal").style.display = "block";
  };
}
if(document.querySelector(".close")) {
  document.querySelector(".close").onclick = () => {
    document.getElementById("quizModal").style.display = "none";
  };
}
window.onclick = function(event) {
  if (event.target == document.getElementById("quizModal")) {
    document.getElementById("quizModal").style.display = "none";
  }
};
function submitQuiz() {
  alert("Quiz submitted. Thank you!");
  document.getElementById("quizModal").style.display = "none";
}
// --- QUIZ DATA ---
const quizQuestions = [
  {
    question: "What type of government does Sierra Leone have?",
    options: [
      "Monarchy",
      "Military Rule",
      "Democracy",
      "Dictatorship"
    ],
    answer: 2
  },
  {
    question: "Which branch of government is responsible for making laws?",
    options: [
      "Executive",
      "Legislative",
      "Judicial",
      "Military"
    ],
    answer: 1
  },
  {
    question: "Who is the head of the Executive branch in Sierra Leone?",
    options: [
      "Chief Justice",
      "Speaker of Parliament",
      "President",
      "Minister of Education"
    ],
    answer: 2
  },
  {
    question: "True or False: The Judiciary interprets laws and ensures justice.",
    options: [
      "True",
      "False"
    ],
    answer: 0
  },
  {
    question: "Which of these is NOT a type of government?",
    options: [
      "Democracy",
      "Monarchy",
      "Dictatorship",
      "Supermarket"
    ],
    answer: 3
  },
  {
    question: "Fill in the blank: Separation of powers helps prevent _______ of power.",
    options: [
      "abuse",
      "sharing",
      "loss",
      "creation"
    ],
    answer: 0
  },
  {
    question: "Which branch approves the national budget?",
    options: [
      "Executive",
      "Legislative",
      "Judicial",
      "Traditional"
    ],
    answer: 1
  },
  {
    question: "Who can declare a law unconstitutional?",
    options: [
      "Executive",
      "Legislative",
      "Judiciary",
      "Police"
    ],
    answer: 2
  },
  {
    question: "What is a key benefit of checks and balances?",
    options: [
      "One branch controls all",
      "Power is balanced and fair",
      "No laws are made",
      "Only the President decides"
    ],
    answer: 1
  },
  {
    question: "Which of these is a way citizens can strengthen government?",
    options: [
      "Vote in elections",
      "Ignore public meetings",
      "Refuse to report corruption",
      "Stay silent"
    ],
    answer: 0
  },
  {
    question: "Who makes up the Legislative branch?",
    options: [
      "Members of Parliament (MPs)",
      "Judges",
      "Ministers",
      "Police"
    ],
    answer: 0
  },
  {
    question: "What is the main function of the Executive branch?",
    options: [
      "Enforces laws",
      "Makes laws",
      "Interprets laws",
      "Organizes sports"
    ],
    answer: 0
  },
  {
    question: "Which of these is an example of a check and balance?",
    options: [
      "President appoints ministers, Parliament approves",
      "President makes all decisions alone",
      "Judiciary passes laws",
      "Parliament runs the courts"
    ],
    answer: 0
  },
  {
    question: "What is the purpose of separation of powers?",
    options: [
      "To prevent any one branch from having too much power",
      "To make government slow",
      "To confuse citizens",
      "To avoid elections"
    ],
    answer: 0
  },
  {
    question: "Complete the quote: 'Government of the people, by the people, for the ______.'",
    options: [
      "leaders",
      "people",
      "president",
      "judges"
    ],
    answer: 1
  }
];

// --- QUIZ LOGIC ---
let currentQ = 0;
let userAnswers = Array(quizQuestions.length).fill(null);
let lastQuizAnswers = null;

function renderQuizQuestion() {
  const quizContent = document.getElementById("quizContent");
  const quizNav = document.getElementById("quizNav");
  const reviewBtn = document.getElementById("reviewQuizBtn");
  if (currentQ >= quizQuestions.length) {
    // Show result
    const correct = userAnswers.filter((ans, i) => ans === quizQuestions[i].answer).length;
    const pass = correct >= 12; // 80% to pass
    quizContent.innerHTML = `<h3>Your Score: ${correct} / ${quizQuestions.length}</h3>
      <p>${pass ? '🎉 Congratulations! You passed the quiz.' : '❌ You did not pass. Try again.'}</p>`;
    quizNav.innerHTML = `<button id=\"closeQuiz\">Close</button>`;
    // Store answers for review
    lastQuizAnswers = { answers: [...userAnswers], score: correct };
    localStorage.setItem('level3_lastQuiz', JSON.stringify(lastQuizAnswers));
    // Show review button
    if (reviewBtn) reviewBtn.style.display = '';
    document.getElementById("closeQuiz").onclick = () => {
      document.getElementById("quizModal").style.display = "none";
      if (pass) {
        // Mark Level 3 quiz as complete in user progress
        const user = JSON.parse(localStorage.getItem('civic_user'));
        if (user && user.progress) {
          user.progress[2] = 100;
          localStorage.setItem('civic_user', JSON.stringify(user));
          if (user.email) {
            localStorage.setItem(user.email + '_profile', JSON.stringify(user));
          }
        }
      }
    };
    return;
  }
  const q = quizQuestions[currentQ];
  quizContent.innerHTML = `<p><strong>Question ${currentQ + 1}:</strong> ${q.question}</p>
    <form id="quizForm">
      ${q.options.map((opt, i) => `
        <label style="display:block;margin-bottom:8px;">
          <input type="radio" name="option" value="${i}" ${userAnswers[currentQ] === i ? 'checked' : ''}/> ${opt}
        </label>
      `).join('')}
    </form>`;
  quizNav.innerHTML = `
    <button id="prevQ" ${currentQ === 0 ? 'disabled' : ''}>Previous</button>
    <button id="nextQ">${currentQ === quizQuestions.length - 1 ? 'Submit' : 'Next'}</button>
  `;
  document.getElementById("prevQ").onclick = () => {
    currentQ--;
    renderQuizQuestion();
  };
  document.getElementById("nextQ").onclick = () => {
    const selected = document.querySelector('input[name="option"]:checked');
    if (!selected) {
      alert('Please select an answer.');
      return;
    }
    userAnswers[currentQ] = parseInt(selected.value);
    currentQ++;
    renderQuizQuestion();
  };
}

// Show quiz modal and start quiz
const takeQuizBtn = document.getElementById("takeQuizBtn");
if (takeQuizBtn) {
  takeQuizBtn.onclick = () => {
    currentQ = 0;
    userAnswers = Array(quizQuestions.length).fill(null);
    lastQuizAnswers = null;
    if (document.getElementById('reviewQuizBtn')) document.getElementById('reviewQuizBtn').style.display = 'none';
    renderQuizQuestion();
    document.getElementById("quizModal").style.display = "block";
  };
}

// --- REVIEW SYSTEM ---
const reviewBtn = document.getElementById('reviewQuizBtn');
if (reviewBtn) {
  reviewBtn.onclick = () => {
    const reviewModal = document.getElementById('reviewModal');
    const reviewContent = document.getElementById('reviewContent');
    let reviewData = localStorage.getItem('level3_lastQuiz');
    if (!reviewData) {
      reviewContent.innerHTML = '<p>No quiz attempt found to review.</p>';
    } else {
      reviewData = JSON.parse(reviewData);
      let html = `<h3>Your Score: ${reviewData.score} / ${quizQuestions.length}</h3><ol style='margin-left:1em;'>`;
      quizQuestions.forEach((q, i) => {
        const userAns = reviewData.answers[i];
        const correct = userAns === q.answer;
        html += `<li style='margin-bottom:10px;'><strong>Q${i+1}:</strong> ${q.question}<br/>`;
        html += `Your answer: <span style='color:${correct ? 'green' : 'red'}'>${userAns !== null ? q.options[userAns] : 'No answer'}</span><br/>`;
        if (!correct) {
          html += `Correct answer: <span style='color:green'>${q.options[q.answer]}</span><br/>`;
        }
        html += '</li>';
      });
      html += '</ol>';
      reviewContent.innerHTML = html;
    }
    reviewModal.style.display = 'block';
  };
}
const closeReview = document.getElementById('closeReview');
if (closeReview) {
  closeReview.onclick = () => {
    document.getElementById('reviewModal').style.display = 'none';
  };
}
window.onclick = function(event) {
  if (event.target == document.getElementById('quizModal')) {
    document.getElementById('quizModal').style.display = 'none';
  }
  if (event.target == document.getElementById('reviewModal')) {
    document.getElementById('reviewModal').style.display = 'none';
  }
}; 