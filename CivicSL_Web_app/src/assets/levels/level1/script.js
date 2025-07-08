const lessons = [
  {
    id: 1,
    title: "Module 1: What is Civic Education?",
    summary: "Define civic education, its application, and key elements.",
    fullText: `Civic Education is the study of the rights and responsibilities of citizens and how government and society function. It helps people become responsible citizens who contribute positively to their country.\nWhen you obey the law, help clean your community, or vote during elections, you are practicing civic responsibility. Civic education explains why these actions are important.\nKey elements of civic education include:\n- Citizenship\n- Rights and responsibilities\n- Governance and democracy\n- National unity and peacebuilding\n- Participation in public life\n\nEveryday Example: Mariatu, a secondary school student in Makeni, teaches her peers about respecting traffic rules and avoiding littering. She's practicing civic education in real life.\n\nActivity: List three ways you help your community. Discuss with a friend.`,
    videoUrl: ""
  },
  {
    id: 2,
    title: "Module 2: Why Civic Education is Important in Sierra Leone",
    summary: "Understand why civic education matters and its benefits for national development.",
    fullText: `Sierra Leone has faced challenges such as civil war, corruption, tribalism, and low youth participation in governance. Civic education is key to solving these issues.\nBenefits of Civic Education:\n- Promotes peace and tolerance\n- Encourages unity and national identity\n- Increases citizen participation in governance\n- Builds trust in institutions\n\nReal-Life Example: In Kenema, young people who received civic training helped organize peaceful local elections and encouraged others to vote.\n\nActivity: Write a short paragraph about how civic education can help reduce corruption in your community.`,
    videoUrl: ""
  },
  {
    id: 3,
    title: "Module 3: Values of Democracy and Good Citizenship",
    summary: "Identify democratic values and qualities of a good citizen.",
    fullText: `Core Democratic Values:\n- Respect for human rights\n- Freedom of speech and religion\n- Rule of law\n- Free and fair elections\nA good citizen:\n- Is honest and fair\n- Obeys laws\n- Votes and respects others' opinions\n- Participates in community activities\n\nNational Link: A good Sierra Leonean citizen pays taxes, votes wisely, keeps their environment clean, and promotes peace.\n\nActivity: Write down five qualities of a good citizen and describe how you can develop them.`,
    videoUrl: ""
  },
  {
    id: 4,
    title: "Module 4: The Role of the Individual in Society",
    summary: "Understand your role in society and ways to make a positive impact.",
    fullText: `You don't need to be rich or powerful to make a difference. Every action you take can help build a better community.\nRoles You Can Play:\n- Educate others about their rights\n- Report injustice and corruption\n- Volunteer in cleanup or charity projects\n- Vote and attend community meetings\n\nStory: Zainab, a 17-year-old from Bo, started a group to clean plastic waste in her community. She inspired others to join, and together they made a big difference.\n\nChallenge Task: Create a poster (drawn or digital) with a civic message such as "Be the Change! Respect the Law!" and share it online or in your school.`,
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
    <iframe src="${lesson.videoUrl}" frameborder="0" allowfullscreen></iframe>
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
document.getElementById("takeQuizBtn").onclick = () => {
  document.getElementById("quizModal").style.display = "block";
};

document.querySelector(".close").onclick = () => {
  document.getElementById("quizModal").style.display = "none";
};

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
    question: "What does civic education mainly teach?",
    options: [
      "How to dance",
      "How to become rich",
      "How to be a good citizen",
      "How to use social media"
    ],
    answer: 2
  },
  {
    question: "List three key elements of civic education.",
    options: [
      "Citizenship, Rights and responsibilities, Governance and democracy",
      "Dancing, Cooking, Shopping",
      "Sports, Music, Art",
      "None of the above"
    ],
    answer: 0
  },
  {
    question: "True or False: Civic education can help reduce tribalism.",
    options: [
      "True",
      "False"
    ],
    answer: 0
  },
  {
    question: "Which of the following is a benefit of civic education?",
    options: [
      "Promotes peace and tolerance",
      "Encourages violence",
      "Discourages voting",
      "Teaches only math"
    ],
    answer: 0
  },
  {
    question: "Fill in the Blank: A good citizen always obeys the _______.",
    options: [
      "law",
      "weather",
      "teacher",
      "internet"
    ],
    answer: 0
  },
  {
    question: "Which of these is NOT a core democratic value?",
    options: [
      "Respect for human rights",
      "Freedom of speech",
      "Corruption",
      "Rule of law"
    ],
    answer: 2
  },
  {
    question: "A good Sierra Leonean citizen should:",
    options: [
      "Pay taxes, vote wisely, keep the environment clean, and promote peace",
      "Ignore elections",
      "Litter in the community",
      "Break the law"
    ],
    answer: 0
  },
  {
    question: "Short Answer: Name one thing you can do to help your community.",
    options: [
      "Volunteer in cleanup projects",
      "Ignore community needs",
      "Refuse to vote",
      "Disrespect others"
    ],
    answer: 0
  },
  {
    question: "Which of these is a responsibility of a citizen?",
    options: [
      "Obey the law",
      "Disobey laws",
      "Refuse to pay taxes",
      "Ignore community activities"
    ],
    answer: 0
  },
  {
    question: "What is one way to participate in public life?",
    options: [
      "Vote and attend community meetings",
      "Stay at home always",
      "Never speak up",
      "Break the law"
    ],
    answer: 0
  },
  {
    question: "Who is Mariatu and what did she do?",
    options: [
      "A student who taught peers about respecting traffic rules and avoiding littering",
      "A famous singer",
      "A politician",
      "A shopkeeper"
    ],
    answer: 0
  },
  {
    question: "Why is civic education important in Sierra Leone?",
    options: [
      "It helps solve issues like civil war, corruption, and tribalism",
      "It teaches only sports",
      "It is not important",
      "It encourages tribalism"
    ],
    answer: 0
  },
  {
    question: "What is the role of the individual in society?",
    options: [
      "To make a positive impact through actions like volunteering and reporting injustice",
      "To ignore community needs",
      "To break the law",
      "To avoid voting"
    ],
    answer: 0
  },
  {
    question: "What is one activity you can do after this lesson?",
    options: [
      "Create a poster with a civic message",
      "Ignore the lesson",
      "Refuse to participate",
      "Break the law"
    ],
    answer: 0
  },
  {
    question: "Which of these is a quality of a good citizen?",
    options: [
      "Honesty and fairness",
      "Corruption",
      "Laziness",
      "Disrespect"
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
    localStorage.setItem('level1_lastQuiz', JSON.stringify(lastQuizAnswers));
    // Show review button
    if (reviewBtn) reviewBtn.style.display = '';
    document.getElementById("closeQuiz").onclick = () => {
      document.getElementById("quizModal").style.display = "none";
      if (pass) {
        // Mark Level 1 quiz as complete in user progress
        const user = JSON.parse(localStorage.getItem('civic_user'));
        if (user && user.progress) {
          user.progress[0] = 100;
          // Award badges
          user.badges = user.badges || [];
          if (!user.badges.includes('first_quiz')) user.badges.push('first_quiz');
          if (correct === quizQuestions.length && !user.badges.includes('high_score')) user.badges.push('high_score');
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

// Review Quiz logic
const reviewBtn = document.getElementById('reviewQuizBtn');
if (reviewBtn) {
  reviewBtn.onclick = () => {
    // Load last answers
    let review = lastQuizAnswers;
    if (!review) {
      review = JSON.parse(localStorage.getItem('level1_lastQuiz'));
    }
    if (!review) {
      alert('No quiz to review yet.');
      return;
    }
    const reviewContent = document.getElementById('reviewContent');
    reviewContent.innerHTML = quizQuestions.map((q, i) => {
      const userAns = review.answers[i];
      const correctAns = q.answer;
      return `<div class='mb-4'>
        <div class='font-semibold'>Q${i+1}: ${q.question}</div>
        <div>
          ${q.options.map((opt, idx) => {
            let style = '';
            if (idx === correctAns) style += 'background:#bbf7d0;'; // green for correct
            if (userAns === idx && userAns !== correctAns) style += 'background:#fee2e2;'; // red for wrong
            return `<span style='display:inline-block;margin:2px 0;padding:2px 8px;border-radius:6px;${style}'>${opt}${idx === userAns ? ' <b>(Your answer)</b>' : ''}${idx === correctAns ? ' <b>(Correct)</b>' : ''}</span>`;
          }).join('<br>')}
        </div>
      </div>`;
    }).join('');
    document.getElementById('reviewModal').style.display = 'block';
  };
}
document.getElementById('closeReview').onclick = () => {
  document.getElementById('reviewModal').style.display = 'none';
};
