const lessons = [
  {
    id: 1,
    title: "Module 1: Introduction to the 1991 Constitution",
    summary: "Define what a constitution is, its purpose, and key features of the 1991 Constitution.",
    fullText: `A constitution is the highest law of the land. It provides the rules by which a country is governed. It protects citizens' rights, outlines duties of government, and ensures justice and order.\nThe 1991 Constitution of Sierra Leone replaced the 1978 Constitution and returned the country to a multi-party democratic system after years of one-party rule and military control.\nKey Features:\n- Recognizes fundamental human rights and freedoms\n- Defines the roles of the three arms of government (executive, legislature, judiciary)\n- Guarantees free and fair elections\n- Promotes decentralization and local government\n\nActivity: Search online or in your textbook for a copy of the Constitution and find three rights it protects.`,
    videoUrl: ""
  },
  {
    id: 2,
    title: "Module 2: Fundamental Human Rights and Freedoms",
    summary: "Define human rights, identify rights protected in the Constitution, and their everyday application.",
    fullText: `Human rights are the basic freedoms and protections that every person is entitled to regardless of their background. These include the right to life, freedom of speech, education, and protection from discrimination.\nExamples of Rights in the 1991 Constitution:\n- Right to life\n- Freedom of expression\n- Right to education\n- Right to participate in elections\n- Right to fair trial\n- Freedom of religion\n- Right to own property\n\nReal-Life Application: Abu, a student in Kenema, used his freedom of expression to write an article encouraging youth to participate in elections. The Constitution protects his right to share opinions peacefully.\n\nActivity: Write down three rights you enjoy every day and explain why they are important to you.`,
    videoUrl: ""
  },
  {
    id: 3,
    title: "Module 3: The Rule of Law and Its Importance",
    summary: "Understand what the rule of law means, its importance, and how it protects citizens.",
    fullText: `The rule of law means everyone is equal before the law—whether poor or rich, young or old, president or farmer. It ensures justice and fairness.\nImportance of the Rule of Law:\n- Prevents abuse of power\n- Protects individual rights\n- Promotes peace and security\n- Builds public trust in institutions\n\nSierra Leone Example: In a case where a politician misuses government funds, the Anti-Corruption Commission (ACC) investigates and holds them accountable under the law—regardless of their status.\n\nActivity: Think of a time when a law helped someone in your community. Share it as a short story.`,
    videoUrl: ""
  },
  {
    id: 4,
    title: "Module 4: The Justice System in Sierra Leone",
    summary: "Understand how the justice system works, the roles of courts and judges, and citizen access to justice.",
    fullText: `The justice system is the structure through which disputes are settled, crimes are judged, and laws are enforced. It includes courts, judges, lawyers, police, and correctional officers.\nMain Courts:\n- Magistrate Courts: Handle minor cases.\n- High Courts: Handle serious civil and criminal cases.\n- Court of Appeal: Hears appeals from lower courts.\n- Supreme Court: Final court of appeal, interprets the Constitution.\nOther Institutions:\n- Legal Aid Board: Provides free legal help to those who cannot afford a lawyer.\n- Human Rights Commission: Monitors and protects human rights in the country.\n\nActivity: Interview someone in your community (e.g., a teacher or local leader) about a time they experienced or witnessed justice being served. Summarize what you learned.`,
    videoUrl: ""
  },
  {
    id: 5,
    title: "Bonus: Your Responsibilities as a Citizen",
    summary: "Recognize that with rights come responsibilities and identify key civic responsibilities.",
    fullText: `While the Constitution protects your rights, it also expects you to:\n- Obey the law\n- Respect others' rights\n- Pay taxes\n- Participate in elections\n- Serve your community\n- Report crimes or corruption\n\nQuote: "The price of freedom is responsibility." – Nelson Mandela\n\nReal-Life Action: Amie, a 19-year-old in Port Loko, volunteers every month to teach young girls about their rights. She is practicing civic responsibility.\n\nActivity: Create a digital poster with the title: "My Rights, My Responsibilities" including images and short messages.`,
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
    question: "What is a constitution?",
    options: [
      "A textbook",
      "A national dance",
      "A set of laws and principles for governance",
      "A church document"
    ],
    answer: 2
  },
  {
    question: "Which year was the current Sierra Leone Constitution adopted?",
    options: [
      "1978",
      "1991",
      "2002",
      "2010"
    ],
    answer: 1
  },
  {
    question: "Which of these is a key feature of the 1991 Constitution?",
    options: [
      "Recognizes fundamental human rights",
      "Promotes only one political party",
      "Bans elections",
      "Removes local government"
    ],
    answer: 0
  },
  {
    question: "True or False: The Constitution allows the government to punish someone without trial.",
    options: [
      "True",
      "False"
    ],
    answer: 1
  },
  {
    question: "Which of these is a fundamental human right in Sierra Leone?",
    options: [
      "Right to life",
      "Right to own a car",
      "Right to travel abroad",
      "Right to be a chief"
    ],
    answer: 0
  },
  {
    question: "Fill in the blank: The rule of law means that no one is _______ the law.",
    options: [
      "above",
      "under",
      "beside",
      "without"
    ],
    answer: 0
  },
  {
    question: "Which institution provides free legal help to those who cannot afford a lawyer?",
    options: [
      "Supreme Court",
      "Legal Aid Board",
      "Parliament",
      "Police"
    ],
    answer: 1
  },
  {
    question: "Which is the highest court in Sierra Leone?",
    options: [
      "Court of Chiefs",
      "Supreme Court",
      "Magistrate Court",
      "Local Council"
    ],
    answer: 1
  },
  {
    question: "What is the main role of the Anti-Corruption Commission (ACC)?",
    options: [
      "Build roads",
      "Investigate and hold people accountable for corruption",
      "Teach in schools",
      "Organize elections"
    ],
    answer: 1
  },
  {
    question: "Which of these is a responsibility of a citizen?",
    options: [
      "Obey the law",
      "Ignore elections",
      "Refuse to pay taxes",
      "Break the law"
    ],
    answer: 0
  },
  {
    question: "Who protects human rights in Sierra Leone?",
    options: [
      "Human Rights Commission",
      "Football Association",
      "Ministry of Tourism",
      "Local Chiefs"
    ],
    answer: 0
  },
  {
    question: "Which of these is NOT a right protected by the Constitution?",
    options: [
      "Right to education",
      "Right to fair trial",
      "Right to participate in elections",
      "Right to steal"
    ],
    answer: 3
  },
  {
    question: "What is the main purpose of the justice system?",
    options: [
      "Settle disputes and enforce laws",
      "Organize sports",
      "Build markets",
      "Teach music"
    ],
    answer: 0
  },
  {
    question: "What should you do if you witness corruption?",
    options: [
      "Report it",
      "Ignore it",
      "Join in",
      "Stay silent"
    ],
    answer: 0
  },
  {
    question: "Complete the quote: 'The price of freedom is ______.'",
    options: [
      "responsibility",
      "money",
      "power",
      "silence"
    ],
    answer: 0
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
    localStorage.setItem('level2_lastQuiz', JSON.stringify(lastQuizAnswers));
    // Show review button
    if (reviewBtn) reviewBtn.style.display = '';
    document.getElementById("closeQuiz").onclick = () => {
      document.getElementById("quizModal").style.display = "none";
      if (pass) {
        // Mark Level 2 quiz as complete in user progress
        const user = JSON.parse(localStorage.getItem('civic_user'));
        if (user && user.progress) {
          user.progress[1] = 100;
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
    let reviewData = localStorage.getItem('level2_lastQuiz');
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