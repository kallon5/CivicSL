const lessons = [
  {
    id: 1,
    title: "Module 1: Structure of Local Government in Sierra Leone",
    summary: "Understand what local government is, its structure, and the functions of councils and traditional leaders.",
    fullText: `Local government refers to the administration of towns, cities, districts, and chiefdoms by local authorities. It brings government closer to the people.\nSierra Leone's local government system includes:\n- Local Councils (District, City, Town)\n- Chiefdom Councils (headed by Paramount Chiefs)\nKey Roles:\n- Local Councils are elected bodies responsible for planning and implementing development in their areas.\n- Chiefdom Councils help maintain customs and order at the community level.\n\nReal-Life Example: The Bo City Council manages waste collection and local road repairs, while the local Paramount Chief in a nearby village resolves land disputes and enforces traditional laws.\n\nActivity: List three services your local council provides in your area (e.g., water, roads, sanitation).`,
    videoUrl: ""
  },
  {
    id: 2,
    title: "Module 2: Roles of Local Councils and Chiefs",
    summary: "Describe the responsibilities of local councils and the role of traditional leaders.",
    fullText: `Local Councils:\n- Prepare local development plans\n- Manage schools, markets, roads, and clinics\n- Collect local taxes and rates\n- Ensure sanitation and environmental protection\nTraditional Leaders:\n- Maintain peace and order through customary law\n- Solve family and community disputes\n- Preserve cultural heritage\nCollaborative Roles: Both councils and chiefs contribute to community development and harmony.\n\nActivity: Write down a time your local council or chief helped solve a problem in your area.`,
    videoUrl: ""
  },
  {
    id: 3,
    title: "Module 3: Community Engagement and Decision-Making",
    summary: "Define community engagement, ways citizens participate, and its importance.",
    fullText: `Community engagement means taking part in activities that influence decisions in your area. This could be attending town hall meetings, joining community cleanups, or asking questions during public discussions.\nWays to Participate:\n- Voting in local elections\n- Attending ward meetings\n- Reporting issues like broken water pipes or poor roads\n- Volunteering in community programs\n- Serving on local development committees\nWhy Participation Matters:\n- Helps leaders know what people need\n- Increases transparency\n- Builds stronger communities\n- Promotes shared responsibility\n\nActivity: Organize or plan a mock community meeting in class or online. Discuss an issue such as school safety or waste disposal.`,
    videoUrl: ""
  },
  {
    id: 4,
    title: "Module 4: How to Participate in Local Governance",
    summary: "Learn practical steps for engaging in governance and how youth can contribute.",
    fullText: `As a young citizen, you have the power to make a difference:\n- Stay informed about community issues.\n- Respect and communicate with your ward councilor or local chief.\n- Ask questions at public meetings.\n- Participate in budget hearings or school board activities.\nYouth Actions:\n- Raise awareness on social media\n- Join civic education or environmental clubs\n- Start a project (e.g., recycling, literacy, clean water)\n\nReal-Life Example: A youth group in Tonkolili District helped the local council identify areas needing boreholes. As a result, clean water access improved in five communities.\n\nActivity: Create a short video (1–2 minutes) encouraging youth in your area to be more involved in their local council activities.`,
    videoUrl: ""
  },
  {
    id: 5,
    title: "Bonus: Barriers to Participation and How to Overcome Them",
    summary: "Identify common challenges to participation and ways to overcome them.",
    fullText: `Common Barriers:\n- Lack of information\n- Fear of speaking out\n- Belief that "my voice doesn't count"\n- Gender or age discrimination\nSolutions:\n- Civic education and awareness programs\n- Safe spaces for youth and women\n- Encouraging dialogue with leaders\nMotivational Quote: "If you want to go fast, go alone. If you want to go far, go together." – African Proverb\n\nActivity: Write a motivational message that encourages young people to overcome fear and engage in their community.`,
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
    question: "True or False: Paramount Chiefs are elected by all citizens in Sierra Leone.",
    options: [
      "True",
      "False"
    ],
    answer: 1
  },
  {
    question: "Which of these is a duty of a local council?",
    options: [
      "Making national laws",
      "Cleaning public spaces",
      "Judging high court cases",
      "Enforcing national immigration rules"
    ],
    answer: 1
  },
  {
    question: "What is community engagement?",
    options: [
      "Taking part in activities that influence decisions in your area",
      "Ignoring local issues",
      "Only voting in national elections",
      "Complaining on social media only"
    ],
    answer: 0
  },
  {
    question: "Fill in the blank: Community engagement helps build _______ communities.",
    options: [
      "weaker",
      "stronger",
      "smaller",
      "richer"
    ],
    answer: 1
  },
  {
    question: "Which of these is a way to participate in local governance?",
    options: [
      "Staying silent about community problems",
      "Complaining on social media only",
      "Attending ward meetings",
      "Ignoring elections"
    ],
    answer: 2
  },
  {
    question: "Who manages waste collection and local road repairs in Bo City?",
    options: [
      "National Parliament",
      "Bo City Council",
      "Supreme Court",
      "Ministry of Health"
    ],
    answer: 1
  },
  {
    question: "What is a common barrier to participation?",
    options: [
      "Lack of information",
      "Too many meetings",
      "Plenty of resources",
      "No leaders"
    ],
    answer: 0
  },
  {
    question: "Which of these is a solution to overcome barriers to participation?",
    options: [
      "Civic education and awareness programs",
      "Staying silent",
      "Discouraging youth",
      "Avoiding meetings"
    ],
    answer: 0
  },
  {
    question: "Who helped improve clean water access in Tonkolili District?",
    options: [
      "A youth group",
      "The President alone",
      "Supreme Court",
      "National Police"
    ],
    answer: 0
  },
  {
    question: "Which of these is a responsibility of traditional leaders?",
    options: [
      "Maintain peace and order through customary law",
      "Build highways",
      "Run national elections",
      "Write the Constitution"
    ],
    answer: 0
  },
  {
    question: "What is one way to help your community?",
    options: [
      "Volunteer in community programs",
      "Ignore problems",
      "Refuse to participate",
      "Break the law"
    ],
    answer: 0
  },
  {
    question: "Who are local councils responsible to?",
    options: [
      "The people in their area",
      "Only the President",
      "Supreme Court",
      "Ministry of Tourism"
    ],
    answer: 0
  },
  {
    question: "What is a key reason for community participation?",
    options: [
      "It helps leaders know what people need",
      "It wastes time",
      "It causes confusion",
      "It is not important"
    ],
    answer: 0
  },
  {
    question: "What is a collaborative role of councils and chiefs?",
    options: [
      "Contribute to community development and harmony",
      "Fight each other",
      "Ignore community needs",
      "Only collect taxes"
    ],
    answer: 0
  },
  {
    question: "Complete the proverb: 'If you want to go far, go ______.'",
    options: [
      "alone",
      "together",
      "quickly",
      "slowly"
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
    localStorage.setItem('level4_lastQuiz', JSON.stringify(lastQuizAnswers));
    // Show review button
    if (reviewBtn) reviewBtn.style.display = '';
    document.getElementById("closeQuiz").onclick = () => {
      document.getElementById("quizModal").style.display = "none";
      if (pass) {
        // Mark Level 4 quiz as complete in user progress
        const user = JSON.parse(localStorage.getItem('civic_user'));
        if (user && user.progress) {
          user.progress[3] = 100;
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
    let reviewData = localStorage.getItem('level4_lastQuiz');
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