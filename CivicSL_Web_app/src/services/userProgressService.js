import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection,
  query,
  where,
  orderBy,
  limit as limitFn,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase/config';

// User Progress Service
export class UserProgressService {
  // Get user progress document
  static async getUserProgress(userId, displayName = null) {
    try {
      const userDoc = await getDoc(doc(db, 'userProgress', userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        // Update display name if provided and different
        if (displayName && data.displayName !== displayName) {
          await updateDoc(doc(db, 'userProgress', userId), {
            displayName: displayName,
            updatedAt: new Date()
          });
          data.displayName = displayName;
        }
        return data;
      } else {
        // Create default progress for new user
        const defaultProgress = {
          userId,
          displayName: displayName || null,
          progress: [0, 0, 0, 0, 0], // 5 levels, 0% complete
          levelXP: [false, false, false, false, false], // XP awarded flags
          xp: 0,
          totalLessonsCompleted: 0,
          totalQuizzesTaken: 0,
          completedLessons: [], // Array to track completed lessons
          certificates: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await setDoc(doc(db, 'userProgress', userId), defaultProgress);
        return defaultProgress;
      }
    } catch (error) {
      console.error('Error getting user progress:', error);
      throw error;
    }
  }

  // Update user progress for a specific level
  static async updateLevelProgress(userId, levelIndex, progress) {
    try {
      const userDocRef = doc(db, 'userProgress', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const newProgress = [...userData.progress];
        // Always set the value, not just Math.max
        newProgress[levelIndex] = progress;
        
        // Award XP if level is completed (100%) and XP hasn't been awarded yet
        let newXP = userData.xp || 0;
        const newLevelXP = [...userData.levelXP];
        
        if (newProgress[levelIndex] >= 100 && !newLevelXP[levelIndex]) {
          newXP += 100;
          newLevelXP[levelIndex] = true;
        }

        console.log('Saving to Firestore:', newProgress);
        await updateDoc(userDocRef, {
          progress: newProgress,
          levelXP: newLevelXP,
          xp: newXP,
          updatedAt: new Date()
        });

        return { progress: newProgress, levelXP: newLevelXP, xp: newXP };
      }
    } catch (error) {
      console.error('Error updating level progress:', error);
      throw error;
    }
  }

  // Mark lesson as completed
  static async completeLesson(userId, levelIndex, moduleId) {
    try {
      const userDocRef = doc(db, 'userProgress', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const newProgress = [...userData.progress];
        
        // Initialize completedLessons array if it doesn't exist
        const completedLessons = userData.completedLessons || [];
        const lessonKey = `${levelIndex}-${moduleId}`;
        
        // Check if this lesson was already completed
        if (completedLessons.includes(lessonKey)) {
          // Lesson already completed, just return current progress
          return newProgress;
        }
        
        // Add this lesson to completed lessons
        completedLessons.push(lessonKey);
        
        // Calculate progress based on completed lessons for this level
        const lessonsPerLevel = [5, 6, 4, 5, 1]; // Lessons per level (level 5 has 1 lesson)
        const levelCompletedLessons = completedLessons.filter(key => key.startsWith(`${levelIndex}-`)).length;
        const newProgressPercent = Math.min(100, (levelCompletedLessons / lessonsPerLevel[levelIndex]) * 100);
        
        newProgress[levelIndex] = newProgressPercent;
        
        await updateDoc(userDocRef, {
          progress: newProgress,
          completedLessons: completedLessons,
          totalLessonsCompleted: completedLessons.length,
          updatedAt: new Date()
        });
        // Award XP for completing a lesson
        await UserProgressService.awardXP(userId, 10, 'Completed a lesson/module');
        return newProgress;
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
      throw error;
    }
  }

  // Complete quiz and award XP
  static async completeQuiz(userId, levelIndex, score, correctAnswers = null, totalQuestions = null) {
    try {
      const userDocRef = doc(db, 'userProgress', userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        let xpEarned = 0;
        // +5 XP for passing (score >= 80)
        if (score >= 80) xpEarned += 5;
        // +1 XP per correct answer (if provided)
        if (typeof correctAnswers === 'number') xpEarned += correctAnswers;
        // +5 bonus XP for perfect score
        if (score === 100) xpEarned += 5;
        await updateDoc(userDocRef, {
          xp: (userData.xp || 0) + xpEarned,
          totalQuizzesTaken: (userData.totalQuizzesTaken || 0) + 1,
          updatedAt: new Date()
        });
        return { xpEarned, totalXP: (userData.xp || 0) + xpEarned };
      }
    } catch (error) {
      console.error('Error completing quiz:', error);
      throw error;
    }
  }

  // Get leaderboard (top users by XP)
  static async getLeaderboard(max = 10) {
    try {
      const q = query(
        collection(db, 'userProgress'),
        orderBy('xp', 'desc'),
        limitFn(max)
      );
      
      const querySnapshot = await getDocs(q);
      const leaderboard = [];
      
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        leaderboard.push({
          id: doc.id,
          userId: doc.id,
          displayName: userData.displayName || null,
          ...userData
        });
      });
      
      return leaderboard;
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      throw error;
    }
  }

  // Award XP to a user
  static async awardXP(userId, amount, reason = '') {
    try {
      const userDocRef = doc(db, 'userProgress', userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        await updateDoc(userDocRef, {
          xp: (userData.xp || 0) + amount,
          updatedAt: new Date()
          // Optionally, you could add an xpHistory array for tracking reasons
        });
      }
    } catch (error) {
      console.error('Error awarding XP:', error);
    }
  }
}

// Learning Streaks Service
export class LearningStreaksService {
  // Helper to get the most recent Monday
  static getMostRecentMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = (day === 0 ? -6 : 1) - day; // Monday = 1
    d.setDate(d.getDate() + diff);
    d.setHours(0,0,0,0);
    return d;
  }

  // Get user's learning streak data
  static async getUserStreak(userId) {
    try {
      const streakDoc = await getDoc(doc(db, 'learningStreaks', userId));
      if (streakDoc.exists()) {
        const data = streakDoc.data();
        // Check if weekStart is current week, else reset
        const today = new Date();
        const weekStart = this.getMostRecentMonday(today).toISOString().slice(0, 10);
        if (!data.weekStart || data.weekStart !== weekStart) {
          // Reset weeklyDays for new week
          await updateDoc(doc(db, 'learningStreaks', userId), {
            weeklyDays: [false, false, false, false, false, false, false],
            weekStart: weekStart
          });
          data.weeklyDays = [false, false, false, false, false, false, false];
          data.weekStart = weekStart;
        }
        return data;
      } else {
        // Create default streak data
        const defaultStreak = {
          userId,
          currentStreak: 0,
          bestStreak: 0,
          lastDate: null,
          weeklyDays: [false, false, false, false, false, false, false], // Mon-Sun
          weeklyCurrentStreak: 0,
          weeklyBestStreak: 0,
          weekStart: this.getMostRecentMonday(new Date()).toISOString().slice(0, 10),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await setDoc(doc(db, 'learningStreaks', userId), defaultStreak);
        return defaultStreak;
      }
    } catch (error) {
      console.error('Error getting user streak:', error);
      throw error;
    }
  }

  // Update daily streak when user learns
  static async updateDailyStreak(userId) {
    try {
      const streakDocRef = doc(db, 'learningStreaks', userId);
      const streakDoc = await getDoc(streakDocRef);
      if (streakDoc.exists()) {
        const streakData = streakDoc.data();
        const today = new Date();
        const todayStr = today.toISOString().slice(0, 10);
        const weekStart = this.getMostRecentMonday(today).toISOString().slice(0, 10);
        let newWeeklyDays = [...(streakData.weeklyDays || [false, false, false, false, false, false, false])];
        if (!streakData.weekStart || streakData.weekStart !== weekStart) {
          newWeeklyDays = [false, false, false, false, false, false, false];
        }
        // Always mark today as active in weeklyDays
        const dayOfWeek = (today.getDay() + 6) % 7; // Monday = 0, Sunday = 6
        newWeeklyDays[dayOfWeek] = true;
        // If already updated today, just update weeklyDays and return
        if (streakData.lastDate === todayStr && streakData.weekStart === weekStart) {
          await updateDoc(streakDocRef, {
            weeklyDays: newWeeklyDays,
            weekStart: weekStart,
            updatedAt: new Date()
          });
          return { ...streakData, weeklyDays: newWeeklyDays, weekStart };
        }
        let newCurrentStreak = streakData.currentStreak || 0;
        let newBestStreak = streakData.bestStreak || 0;
        if (streakData.lastDate) {
          const lastDate = new Date(streakData.lastDate);
          const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            newCurrentStreak += 1;
          } else if (diffDays > 1) {
            newCurrentStreak = 1;
          }
        } else {
          newCurrentStreak = 1;
        }
        if (newCurrentStreak > newBestStreak) {
          newBestStreak = newCurrentStreak;
        }
        // Calculate weekly streak (consecutive true from Monday)
        let weeklyStreak = 0;
        for (let i = 0; i < 7; i++) {
          if (newWeeklyDays[i]) weeklyStreak++;
          else break;
        }
        const newWeeklyBestStreak = Math.max(streakData.weeklyBestStreak || 0, weeklyStreak);
        const updatedStreak = {
          currentStreak: newCurrentStreak,
          bestStreak: newBestStreak,
          lastDate: todayStr,
          weeklyDays: newWeeklyDays,
          weeklyCurrentStreak: weeklyStreak,
          weeklyBestStreak: newWeeklyBestStreak,
          weekStart: weekStart,
          updatedAt: new Date()
        };
        await updateDoc(streakDocRef, updatedStreak);
        return {
          ...streakData,
          ...updatedStreak
        };
      }
    } catch (error) {
      console.error('Error updating daily streak:', error);
      throw error;
    }
  }

  // Get global streak statistics
  static async getGlobalStreakStats() {
    try {
      const q = query(collection(db, 'learningStreaks'));
      const querySnapshot = await getDocs(q);
      
      let totalUsers = 0;
      let totalCurrentStreak = 0;
      let maxStreak = 0;
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        totalUsers++;
        totalCurrentStreak += data.currentStreak || 0;
        maxStreak = Math.max(maxStreak, data.bestStreak || 0);
      });
      
      return {
        totalUsers,
        averageStreak: totalUsers > 0 ? Math.round(totalCurrentStreak / totalUsers) : 0,
        maxStreak
      };
    } catch (error) {
      console.error('Error getting global streak stats:', error);
      throw error;
    }
  }

  // Get top users by current streak or best streak
  static async getStreakLeaderboard(type = 'current', max = 5) {
    try {
      const q = query(collection(db, 'learningStreaks'));
      const querySnapshot = await getDocs(q);
      const leaderboard = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        leaderboard.push({
          id: doc.id,
          userId: doc.id,
          displayName: data.displayName || null,
          currentStreak: data.currentStreak || 0,
          bestStreak: data.bestStreak || 0
        });
      });
      leaderboard.sort((a, b) => (type === 'best' ? b.bestStreak - a.bestStreak : b.currentStreak - a.currentStreak));
      return leaderboard.slice(0, max);
    } catch (error) {
      console.error('Error getting streak leaderboard:', error);
      throw error;
    }
  }
} 