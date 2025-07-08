// Learning content data for all levels
import { level5Data } from '../assets/levels/level5.js';

export const learningContent = {
  level1: {
    id: 1,
    title: 'Level 1: Foundations of Citizenship',
    description: 'Introduce the basics of being a citizen in Sierra Leone.',
    lessons: [
      {
        id: 1,
        title: 'What is Civic Education?',
        summary: 'Learn what civic education means and why it is important for every citizen.',
        content: `Civic education is the study of the rights, responsibilities, and roles of citizens in society. It helps people understand how their country works and how they can contribute to its development. In Sierra Leone, civic education teaches us about our government, our duties, and how to participate in national life.`,
        quiz: {
          questions: [
            {
              question: 'What is the main purpose of civic education?',
              options: [
                'To learn about sports',
                'To understand rights and responsibilities',
                'To study only history',
                'To ignore national issues'
              ],
              answer: 1
            },
            {
              question: 'Civic education helps citizens to...',
              options: [
                'Break the law',
                'Participate in national life',
                'Avoid voting',
                'Ignore their community'
              ],
              answer: 1
            }
          ]
        }
      },
      {
        id: 2,
        title: 'Who is a citizen of Sierra Leone?',
        summary: 'Understand who qualifies as a citizen and the importance of citizenship.',
        content: `A citizen of Sierra Leone is someone who is legally recognized as a member of the country, either by birth, descent, or registration. Citizenship gives you rights and responsibilities.\n\nExample: If you are born in Sierra Leone or your parents are Sierra Leonean, you are a citizen.`,
        quiz: {
          questions: [
            {
              question: 'What does it mean to be a citizen of Sierra Leone?',
              options: [
                'Someone who lives in Sierra Leone',
                'Someone recognized by law as a member of Sierra Leone',
                'Only people who pay taxes',
                'Only government workers'
              ],
              answer: 1
            },
            {
              question: 'Which of these is a responsibility of a citizen?',
              options: [
                'Obeying the law',
                'Ignoring the flag',
                'Breaking the law',
                'Avoiding school'
              ],
              answer: 0
            },
            {
              question: 'What do the colors of the Sierra Leone flag represent?',
              options: [
                'Unity, Freedom, Justice',
                'Agriculture, Unity, The Sea',
                'Peace, Love, Hope',
                'Strength, Honor, Power'
              ],
              answer: 1
            },
            {
              question: 'Why is the constitution important?',
              options: [
                'It is a national song',
                'It sets out the rights and laws of the country',
                'It is a type of food',
                'It is a school rule'
              ],
              answer: 1
            },
            {
              question: 'Which of these is a right protected by the constitution?',
              options: [
                'Right to education',
                'Right to break the law',
                'Right to ignore others',
                'Right to avoid taxes'
              ],
              answer: 0
            }
          ]
        }
      },
      {
        id: 3,
        title: 'Rights and responsibilities of citizens',
        summary: 'Learn about the rights you have and the duties you must perform as a citizen.',
        content: `Citizens have rights such as freedom of speech, right to education, and right to vote. Responsibilities include obeying the law, paying taxes, and respecting others.`,
        quiz: {
          questions: [
            {
              question: 'Which of these is a right?',
              options: [
                'Freedom of speech',
                'Not paying taxes',
                'Breaking the law',
                'Ignoring elections'
              ],
              answer: 0
            },
            {
              question: 'Which of these is a responsibility?',
              options: [
                'Obeying the law',
                'Avoiding taxes',
                'Disrespecting others',
                'Ignoring community needs'
              ],
              answer: 0
            }
          ]
        }
      },
      {
        id: 4,
        title: 'National symbols and their meanings',
        summary: 'Discover the flag, anthem, and coat of arms of Sierra Leone and what they represent.',
        content: `National symbols unite citizens and represent the country's identity.\n- The flag (green, white, blue) stands for agriculture, unity, and the sea.\n- The anthem inspires patriotism.\n- The coat of arms shows lions, a torch, and the motto: "Unity, Freedom, Justice."`,
        quiz: {
          questions: [
            {
              question: 'What does the green color in the flag represent?',
              options: [
                'Unity',
                'Agriculture',
                'The sea',
                'Justice'
              ],
              answer: 1
            },
            {
              question: 'What is the motto on the coat of arms?',
              options: [
                'Unity, Freedom, Justice',
                'Peace and Love',
                'Strength and Honor',
                'Work and Progress'
              ],
              answer: 0
            }
          ]
        }
      },
      {
        id: 5,
        title: 'The constitution (basic introduction)',
        summary: 'Get a simple introduction to the constitution of Sierra Leone.',
        content: `The constitution is the highest law in Sierra Leone. It sets out the rights of citizens, the structure of government, and how laws are made.`,
        quiz: {
          questions: [
            {
              question: 'What is the constitution?',
              options: [
                'A song',
                'The highest law of the land',
                'A type of food',
                'A national symbol'
              ],
              answer: 1
            },
            {
              question: 'The constitution protects...',
              options: [
                'Only the president',
                'The rights of all citizens',
                'Only students',
                'No one'
              ],
              answer: 1
            }
          ]
        }
      }
    ],
    quiz: {
      questions: [
        {
          question: 'What is the main purpose of the rule of law?',
          options: [
            'To protect everyone equally',
            'To help only leaders',
            'To ignore the constitution',
            'To allow unfair treatment'
          ],
          answer: 0
        },
        {
          question: 'Who is responsible for judging cases in Sierra Leone?',
          options: [
            'Police',
            'Courts',
            'Teachers',
            'Chiefs only'
          ],
          answer: 1
        },
        {
          question: 'What does the ACC do?',
          options: [
            'Fights corruption',
            'Teaches in schools',
            'Runs elections',
            'Builds roads'
          ],
          answer: 0
        },
        {
          question: 'Which of these is a human right?',
          options: [
            'Right to life',
            'Right to steal',
            'Right to harm others',
            'Right to ignore laws'
          ],
          answer: 0
        },
        {
          question: 'Why is gender equality important?',
          options: [
            'It gives everyone equal opportunities',
            'It only helps boys',
            'It is not important',
            'It only helps girls'
          ],
          answer: 0
        }
      ]
    }
  },
  level2: {
    id: 2,
    title: 'Level 2: Governance and Democratic Participation',
    description: 'Help users understand how Sierra Leone is governed and how they can participate.',
    lessons: [
      {
        id: 1,
        title: 'The three arms of government: Executive, Legislature, Judiciary',
        summary: 'Learn about the main branches of government and their roles.',
        content: `Sierra Leone's government has three arms: Executive (president and ministers), Legislature (parliament), and Judiciary (courts). Each has its own job to keep the country running smoothly.`,
        quiz: {
          questions: [
            {
              question: 'Which is NOT an arm of government?',
              options: [
                'Executive',
                'Legislature',
                'Judiciary',
                'Market women'
              ],
              answer: 3
            },
            {
              question: 'Who makes the laws?',
              options: [
                'Parliament',
                'The President alone',
                'The Police',
                'Teachers'
              ],
              answer: 0
            }
          ]
        }
      },
      {
        id: 2,
        title: 'Local government and traditional leadership',
        summary: 'Understand how local councils and traditional leaders work in Sierra Leone.',
        content: `Local government includes district, city, and town councils. Traditional leaders like chiefs help keep order and solve disputes. Both work together for community development.`,
        quiz: {
          questions: [
            {
              question: 'Who is a traditional leader?',
              options: [
                'Paramount Chief',
                'Minister',
                'Police Officer',
                'Teacher'
              ],
              answer: 0
            },
            {
              question: 'Local councils are responsible for...',
              options: [
                'Making national laws',
                'Community development',
                'Running schools only',
                'Selling goods'
              ],
              answer: 1
            }
          ]
        }
      },
      {
        id: 3,
        title: 'Elections and the Electoral Commission of Sierra Leone (ECSL)',
        summary: 'Learn how elections are run and the role of the ECSL.',
        content: `Elections allow citizens to choose their leaders. The ECSL organizes elections and makes sure they are free and fair.`,
        quiz: {
          questions: [
            {
              question: 'What does ECSL stand for?',
              options: [
                'Electoral Commission of Sierra Leone',
                'Education Council of Sierra Leone',
                'Economic Council of Sierra Leone',
                'Election Committee of Sierra Leone'
              ],
              answer: 0
            },
            {
              question: 'Why are elections important?',
              options: [
                'They allow citizens to choose leaders',
                'They are just for fun',
                'They are not important',
                'They are only for chiefs'
              ],
              answer: 0
            }
          ]
        }
      },
      {
        id: 4,
        title: 'How to vote and why voting matters',
        summary: 'Understand the voting process and why every vote counts.',
        content: `Voting is a way for citizens to have a say in who leads them. Every vote is important because it helps shape the future of the country.`,
        quiz: {
          questions: [
            {
              question: 'Which arm of government makes the laws?',
              options: [
                'Executive',
                'Legislature',
                'Judiciary',
                'Chiefs'
              ],
              answer: 1
            },
            {
              question: 'Who organizes elections in Sierra Leone?',
              options: [
                'The President',
                'ECSL',
                'Teachers',
                'Police'
              ],
              answer: 1
            },
            {
              question: 'Why is voting important?',
              options: [
                'It helps choose leaders',
                'It is just for fun',
                'It is not important',
                'It is only for chiefs'
              ],
              answer: 0
            },
            {
              question: 'What is a responsibility of local government?',
              options: [
                'Community development',
                'Making national laws',
                'Running only schools',
                'Selling goods'
              ],
              answer: 0
            },
            {
              question: 'Which of these is a civic duty?',
              options: [
                'Paying taxes',
                'Ignoring elections',
                'Breaking the law',
                'Avoiding community work'
              ],
              answer: 0
            }
          ]
        }
      }
    ],
    quiz: {
      questions: [
        {
          question: 'Which arm of government makes the laws?',
          options: [
            'Executive',
            'Legislature',
            'Judiciary',
            'Chiefs'
          ],
          answer: 1
        },
        {
          question: 'Who organizes elections in Sierra Leone?',
          options: [
            'The President',
            'ECSL',
            'Teachers',
            'Police'
          ],
          answer: 1
        },
        {
          question: 'Why is voting important?',
          options: [
            'It helps choose leaders',
            'It is just for fun',
            'It is not important',
            'It is only for chiefs'
          ],
          answer: 0
        },
        {
          question: 'What is a responsibility of local government?',
          options: [
            'Community development',
            'Making national laws',
            'Running only schools',
            'Selling goods'
          ],
          answer: 0
        },
        {
          question: 'Which of these is a civic duty?',
          options: [
            'Paying taxes',
            'Ignoring elections',
            'Breaking the law',
            'Avoiding community work'
          ],
          answer: 0
        }
      ]
    }
  },
  level3: {
    id: 3,
    title: 'Level 3: Rule of Law and Human Rights',
    description: 'Educate about the legal system and basic human rights.',
    lessons: [
      {
        id: 1,
        title: 'Rule of law: what it means and why it matters',
        summary: 'Understand the concept of rule of law and its importance in society.',
        content: `The rule of law means everyone, including leaders, must obey the law. It protects people from unfair treatment and helps keep peace in the country.`,
        quiz: {
          questions: [
            {
              question: 'What does rule of law mean?',
              options: [
                'Only leaders follow the law',
                'Everyone must obey the law',
                'Laws are not important',
                'Only students follow the law'
              ],
              answer: 1
            },
            {
              question: 'Why is rule of law important?',
              options: [
                'It protects people from unfair treatment',
                'It allows people to break rules',
                'It is not important',
                'It only helps leaders'
              ],
              answer: 0
            }
          ]
        }
      },
      {
        id: 2,
        title: 'Justice system in Sierra Leone (police, courts, prisons)',
        summary: 'Learn how the justice system works and the roles of police, courts, and prisons.',
        content: `The justice system includes the police (who enforce laws), the courts (where cases are judged), and prisons (where people who break the law are kept). Each part helps keep order and protect rights.`,
        quiz: {
          questions: [
            {
              question: 'Who enforces the law in Sierra Leone?',
              options: [
                'Police',
                'Teachers',
                'Doctors',
                'Farmers'
              ],
              answer: 0
            },
            {
              question: 'Where are cases judged?',
              options: [
                'Courts',
                'Markets',
                'Schools',
                'Homes'
              ],
              answer: 0
            }
          ]
        }
      },
      {
        id: 3,
        title: 'Human rights and responsibilities',
        summary: 'Discover the basic human rights and the responsibilities that come with them.',
        content: `Human rights are freedoms and protections everyone should have, like the right to life, education, and freedom from discrimination. With rights come responsibilities, such as respecting others' rights.`,
        quiz: {
          questions: [
            {
              question: 'Which of these is a human right?',
              options: [
                'Right to education',
                'Right to steal',
                'Right to harm others',
                'Right to ignore laws'
              ],
              answer: 0
            },
            {
              question: 'With rights come...',
              options: [
                'Responsibilities',
                'No duties',
                'Only fun',
                'No respect for others'
              ],
              answer: 0
            }
          ]
        }
      },
      {
        id: 4,
        title: 'Anti-corruption and transparency (ACC – Anti-Corruption Commission)',
        summary: 'Learn about fighting corruption and the role of the ACC in Sierra Leone.',
        content: `Corruption is when people in power use their position for personal gain. The ACC works to stop corruption and promote honesty in government and society.`,
        quiz: {
          questions: [
            {
              question: 'What does ACC stand for?',
              options: [
                'Anti-Corruption Commission',
                'African Culture Club',
                'Association of Civic Citizens',
                'Academic Council Committee'
              ],
              answer: 0
            },
            {
              question: 'Why is transparency important?',
              options: [
                'It helps prevent corruption',
                'It hides information',
                'It is not important',
                'It only helps leaders'
              ],
              answer: 0
            }
          ]
        }
      },
      {
        id: 5,
        title: 'Gender equality and rights of children, youth, and persons with disabilities',
        summary: 'Understand the importance of equality and rights for all groups in society.',
        content: `Everyone deserves equal rights, no matter their gender, age, or ability. Gender equality means boys and girls have the same opportunities. Children, youth, and persons with disabilities must be protected and included.`,
    quiz: {
      questions: [
        {
              question: 'What is gender equality?',
          options: [
                'Boys and girls have the same opportunities',
                'Only boys have rights',
                'Only girls have rights',
                'No one has rights'
          ],
          answer: 0
        },
        {
              question: 'Who deserves equal rights?',
          options: [
                'Everyone',
                'Only adults',
                'Only leaders',
                'Only students'
          ],
          answer: 0
            }
          ]
        }
      }
    ],
    quiz: {
      questions: [
        {
          question: 'What is the main purpose of the rule of law?',
          options: [
            'To protect everyone equally',
            'To help only leaders',
            'To ignore the constitution',
            'To allow unfair treatment'
          ],
          answer: 0
        },
        {
          question: 'Who is responsible for judging cases in Sierra Leone?',
          options: [
            'Police',
            'Courts',
            'Teachers',
            'Chiefs only'
          ],
          answer: 1
        },
        {
          question: 'What does the ACC do?',
          options: [
            'Fights corruption',
            'Teaches in schools',
            'Runs elections',
            'Builds roads'
          ],
          answer: 0
        },
        {
          question: 'Which of these is a human right?',
          options: [
            'Right to life',
            'Right to steal',
            'Right to harm others',
            'Right to ignore laws'
          ],
          answer: 0
        },
        {
          question: 'Why is gender equality important?',
          options: [
            'It gives everyone equal opportunities',
            'It only helps boys',
            'It is not important',
            'It only helps girls'
          ],
          answer: 0
        }
      ]
    }
  },
  level4: {
    id: 4,
    title: 'Level 4: National Development and Civic Engagement',
    description: 'Promote active civic participation in national development.',
    lessons: [
      {
        id: 1,
        title: 'How civic actions contribute to development',
        summary: 'Learn how being an active citizen helps Sierra Leone grow.',
        content: `When citizens volunteer, vote, and help their communities, they support national development. Civic actions like cleaning up, helping others, and reporting problems make the country better.`,
        quiz: {
          questions: [
            {
              question: 'How can you contribute to national development?',
              options: [
                'By helping your community',
                'By ignoring problems',
                'By breaking the law',
                'By not voting'
              ],
              answer: 0
            },
            {
              question: 'What is one civic action?',
              options: [
                'Volunteering',
                'Littering',
                'Cheating',
                'Ignoring others'
              ],
              answer: 0
            }
          ]
        }
      },
      {
        id: 2,
        title: 'Environmental responsibility and community health',
        summary: 'Understand why caring for the environment and health is a civic duty.',
        content: `Citizens should keep their environment clean and support health in their communities. This includes proper waste disposal, planting trees, and helping prevent disease.`,
        quiz: {
          questions: [
            {
              question: 'Why is environmental responsibility important?',
              options: [
                'It keeps communities healthy',
                'It causes pollution',
                'It is not important',
                'It only helps animals'
              ],
              answer: 0
            },
            {
              question: 'Which of these is a civic duty?',
              options: [
                'Keeping the environment clean',
                'Throwing trash anywhere',
                'Ignoring health issues',
                'Damaging trees'
              ],
              answer: 0
            }
          ]
        }
      },
      {
        id: 3,
        title: 'Peacebuilding and conflict resolution',
        summary: 'Learn how to build peace and resolve conflicts in your community.',
        content: `Peacebuilding means working to prevent and solve conflicts peacefully. Citizens can help by listening, respecting others, and finding solutions together.`,
        quiz: {
          questions: [
            {
              question: 'What is peacebuilding?',
              options: [
                'Working to prevent and solve conflicts peacefully',
                'Starting fights',
                'Ignoring problems',
                'Only helping friends'
              ],
              answer: 0
            },
            {
              question: 'How can you resolve conflicts?',
              options: [
                'By listening and respecting others',
                'By shouting',
                'By fighting',
                'By ignoring everyone'
              ],
              answer: 0
            }
          ]
        }
      },
      {
        id: 4,
        title: 'Youth and women in leadership',
        summary: 'Understand the importance of youth and women taking leadership roles.',
        content: `Youth and women can be leaders in their communities and the nation. Their participation brings new ideas and helps solve problems.`,
        quiz: {
          questions: [
            {
              question: 'Why is it important for youth and women to be leaders?',
              options: [
                'They bring new ideas and help solve problems',
                'Only men should lead',
                'It is not important',
                'They cannot lead'
              ],
              answer: 0
            },
            {
              question: 'Who can be a leader?',
              options: [
                'Anyone, including youth and women',
                'Only adults',
                'Only men',
                'Only teachers'
              ],
              answer: 0
            }
          ]
        }
      },
      {
        id: 5,
        title: 'Volunteerism, NGOs, and CSOs in Sierra Leone',
        summary: 'Learn about the role of volunteers, NGOs, and CSOs in national development.',
        content: `Volunteers, NGOs (Non-Governmental Organizations), and CSOs (Civil Society Organizations) help solve problems and support communities. They work in health, education, environment, and more.`,
        quiz: {
          questions: [
            {
              question: 'What is an NGO?',
              options: [
                'Non-Governmental Organization',
                'National Government Office',
                'New Generation Organization',
                'None of the above'
              ],
              answer: 0
            },
            {
              question: 'How do volunteers help?',
              options: [
                'By supporting communities',
                'By causing problems',
                'By ignoring issues',
                'By only working for money'
              ],
              answer: 0
            }
          ]
        }
      }
    ],
    quiz: {
      questions: [
        {
          question: 'How can citizens help national development?',
          options: [
            'By volunteering and helping their community',
            'By ignoring problems',
            'By breaking the law',
            'By not voting'
          ],
          answer: 0
        },
        {
          question: 'Why is environmental responsibility important?',
          options: [
            'It keeps communities healthy',
            'It causes pollution',
            'It is not important',
            'It only helps animals'
          ],
          answer: 0
        },
        {
          question: 'What is peacebuilding?',
          options: [
            'Working to prevent and solve conflicts peacefully',
            'Starting fights',
            'Ignoring problems',
            'Only helping friends'
          ],
          answer: 0
        },
        {
          question: 'Who can be a leader in Sierra Leone?',
          options: [
            'Anyone, including youth and women',
            'Only adults',
            'Only men',
            'Only teachers'
          ],
          answer: 0
        },
        {
          question: 'What is the role of NGOs and CSOs?',
          options: [
            'To help solve problems and support communities',
            'To cause problems',
            'To ignore issues',
            'To only work for money'
          ],
          answer: 0
        }
      ]
    }
  },
  level5: level5Data
};

// For each lesson in each level, keep only the first 2 questions in the quiz.questions array
Object.keys(learningContent).forEach(levelKey => {
  const level = learningContent[levelKey];
  if (level.lessons) {
    level.lessons.forEach(lesson => {
      if (lesson.quiz && lesson.quiz.questions && lesson.quiz.questions.length > 2) {
        lesson.quiz.questions = lesson.quiz.questions.slice(0, 2);
      }
    });
  }
});

// Service functions
export const LearningContentService = {
  // Get all levels
  getAllLevels() {
    return Object.values(learningContent);
  },

  // Get a specific level
  getLevel(levelId) {
    return learningContent[`level${levelId}`];
  },

  // Get a specific lesson
  getLesson(levelId, lessonId) {
    const level = this.getLevel(levelId);
    if (!level) return null;
    return level.lessons.find(lesson => lesson.id === lessonId);
  },

  // Get quiz for a level
  getQuiz(levelId) {
    const level = this.getLevel(levelId);
    return level ? level.quiz : null;
  },

  // Mark lesson as completed
  markLessonCompleted(levelId, lessonId) {
    const lesson = this.getLesson(levelId, lessonId);
    if (lesson) {
      lesson.completed = true;
    }
  },

  // Get progress for a level
  getLevelProgress(levelId) {
    const level = this.getLevel(levelId);
    if (!level) return 0;
    
    const completedLessons = level.lessons.filter(lesson => lesson.completed).length;
    return Math.round((completedLessons / level.lessons.length) * 100);
  }
}; 