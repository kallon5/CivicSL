import { db } from '../firebase/config';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
  getDoc,
  deleteDoc
} from 'firebase/firestore';
import { UserProgressService } from './userProgressService';

const discussionsRef = collection(db, 'discussions');
const commentsRef = collection(db, 'comments');
const notificationsRef = collection(db, 'notifications');

export const getDiscussions = async ({ category = '', search = '', sort = 'recent' } = {}) => {
  let q = discussionsRef;
  if (category) q = query(q, where('category', '==', category));
  // Remove orderBy to avoid index requirements for now
  // if (sort === 'popular') q = query(q, orderBy('commentsCount', 'desc'));
  // else if (sort === 'active') q = query(q, orderBy('lastActivity', 'desc'));
  // else q = query(q, orderBy('createdAt', 'desc'));
  
  try {
    const snapshot = await getDocs(q);
    let results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Client-side sorting
    if (sort === 'popular') {
      results.sort((a, b) => (b.commentsCount || 0) - (a.commentsCount || 0));
    } else if (sort === 'active') {
      results.sort((a, b) => {
        const aTime = a.lastActivity?.toDate ? a.lastActivity.toDate() : new Date(0);
        const bTime = b.lastActivity?.toDate ? b.lastActivity.toDate() : new Date(0);
        return bTime - aTime;
      });
    } else {
      results.sort((a, b) => {
        const aTime = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
        const bTime = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
        return bTime - aTime;
      });
    }
    
    if (search) {
      results = results.filter(d =>
        d.title?.toLowerCase().includes(search.toLowerCase()) ||
        d.body?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return results;
  } catch (error) {
    console.error('Error fetching discussions:', error);
    return [];
  }
};

export const addDiscussion = async ({ category, title, body, user }) => {
  try {
    const result = await addDoc(discussionsRef, {
      category,
      title,
      body,
      user: user ? { uid: user.uid, name: user.displayName || 'Anonymous' } : null,
      createdAt: serverTimestamp(),
      lastActivity: serverTimestamp(),
      commentsCount: 0,
      likesCount: 0,
      likedBy: []
    });
    // Award XP for starting a discussion
    if (user?.uid) {
      await UserProgressService.awardXP(user.uid, 5, 'Started a discussion');
    }
    return result;
  } catch (error) {
    console.error('Error adding discussion:', error);
    throw error;
  }
};

export const subscribeToDiscussions = (callback, { category = '', sort = 'recent' } = {}) => {
  let q = discussionsRef;
  if (category) q = query(q, where('category', '==', category));
  // Remove orderBy to avoid index requirements
  
  try {
    return onSnapshot(q, snapshot => {
      let results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Client-side sorting
      if (sort === 'popular') {
        results.sort((a, b) => (b.commentsCount || 0) - (a.commentsCount || 0));
      } else if (sort === 'active') {
        results.sort((a, b) => {
          const aTime = a.lastActivity?.toDate ? a.lastActivity.toDate() : new Date(0);
          const bTime = b.lastActivity?.toDate ? b.lastActivity.toDate() : new Date(0);
          return bTime - aTime;
        });
      } else {
        results.sort((a, b) => {
          const aTime = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
          const bTime = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
          return bTime - aTime;
        });
      }
      
      callback(results);
    }, error => {
      console.error('Error in discussions subscription:', error);
      callback([]);
    });
  } catch (error) {
    console.error('Error setting up discussions subscription:', error);
    return () => {};
  }
};

// Comments functions
export const getComments = async (discussionId) => {
  try {
    const q = query(
      collection(db, 'comments'),
      where('discussionId', '==', discussionId)
      // Remove orderBy to avoid index requirements
    );
    const snapshot = await getDocs(q);
    let results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Client-side sorting by creation time
    results.sort((a, b) => {
      const aTime = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
      const bTime = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
      return aTime - bTime;
    });
    
    return results;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

export const addComment = async ({ discussionId, body, user, parentCommentId = null }) => {
  try {
    const commentData = {
      discussionId,
      body,
      user: user ? { uid: user.uid, name: user.displayName || 'Anonymous' } : null,
      createdAt: serverTimestamp(),
      likesCount: 0,
      likedBy: [],
      parentCommentId
    };
    
    const commentRef = await addDoc(commentsRef, commentData);
    
    // Award XP for posting a comment or reply
    if (user?.uid) {
      await UserProgressService.awardXP(user.uid, 2, 'Posted a comment or reply');
    }
    
    // Update discussion's comment count and last activity
    const discussionRef = doc(db, 'discussions', discussionId);
    await updateDoc(discussionRef, {
      commentsCount: increment(1),
      lastActivity: serverTimestamp()
    });
    
    // Create notification for discussion author
    try {
      const discussionDoc = await getDoc(discussionRef);
      const discussion = discussionDoc.data();
      if (discussion?.user?.uid && discussion.user.uid !== user?.uid) {
        await addNotification({
          userId: discussion.user.uid,
          type: 'comment',
          title: 'New comment on your discussion',
          body: `${user?.displayName || 'Someone'} commented on "${discussion.title}"`,
          discussionId,
          commentId: commentRef.id
        });
      }
    } catch (error) {
      console.error('Error creating notification:', error);
    }
    
    return commentRef;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const subscribeToComments = (discussionId, callback) => {
  try {
    const q = query(
      collection(db, 'comments'),
      where('discussionId', '==', discussionId)
      // Remove orderBy to avoid index requirements
    );
    
    return onSnapshot(q, snapshot => {
      let results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Client-side sorting by creation time
      results.sort((a, b) => {
        const aTime = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
        const bTime = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
        return aTime - bTime;
      });
      
      callback(results);
    }, error => {
      console.error('Error in comments subscription:', error);
      callback([]);
    });
  } catch (error) {
    console.error('Error setting up comments subscription:', error);
    return () => {};
  }
};

// Likes functions
export const toggleLike = async ({ discussionId, userId, userName }) => {
  try {
    const discussionRef = doc(db, 'discussions', discussionId);
    const discussionDoc = await getDoc(discussionRef);
    const discussion = discussionDoc.data();
    
    const isLiked = discussion.likedBy?.includes(userId);
    
    if (isLiked) {
      // Unlike
      await updateDoc(discussionRef, {
        likesCount: increment(-1),
        likedBy: arrayRemove(userId)
      });
    } else {
      // Like
      await updateDoc(discussionRef, {
        likesCount: increment(1),
        likedBy: arrayUnion(userId)
      });
      
      // Create notification for discussion author
      if (discussion?.user?.uid && discussion.user.uid !== userId) {
        await addNotification({
          userId: discussion.user.uid,
          type: 'like',
          title: 'Someone liked your discussion',
          body: `${userName} liked "${discussion.title}"`,
          discussionId
        });
      }
    }
    
    return !isLiked;
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

export const toggleCommentLike = async ({ commentId, userId, userName }) => {
  try {
    const commentRef = doc(db, 'comments', commentId);
    const commentDoc = await getDoc(commentRef);
    const comment = commentDoc.data();
    
    const isLiked = comment.likedBy?.includes(userId);
    
    if (isLiked) {
      await updateDoc(commentRef, {
        likesCount: increment(-1),
        likedBy: arrayRemove(userId)
      });
    } else {
      await updateDoc(commentRef, {
        likesCount: increment(1),
        likedBy: arrayUnion(userId)
      });
      
      // Award XP to comment author for receiving a like (not if liker is the author)
      if (comment?.user?.uid && comment.user.uid !== userId) {
        await UserProgressService.awardXP(comment.user.uid, 1, 'Received a like on a comment or reply');
      }
      
      // Create notification for comment author
      if (comment?.user?.uid && comment.user.uid !== userId) {
        await addNotification({
          userId: comment.user.uid,
          type: 'comment_like',
          title: 'Someone liked your comment',
          body: `${userName} liked your comment`,
          commentId
        });
      }
    }
    
    return !isLiked;
  } catch (error) {
    console.error('Error toggling comment like:', error);
    throw error;
  }
};

export const toggleCommentDislike = async ({ commentId, userId, userName }) => {
  try {
    const commentRef = doc(db, 'comments', commentId);
    const commentDoc = await getDoc(commentRef);
    const comment = commentDoc.data();

    const isDisliked = comment.dislikedBy?.includes(userId);
    const isLiked = comment.likedBy?.includes(userId);
    const updates = {};

    if (isDisliked) {
      // Remove dislike
      updates.dislikesCount = increment(-1);
      updates.dislikedBy = arrayRemove(userId);
    } else {
      // Add dislike
      updates.dislikesCount = increment(1);
      updates.dislikedBy = arrayUnion(userId);
      // If user had liked, remove like
      if (isLiked) {
        updates.likesCount = increment(-1);
        updates.likedBy = arrayRemove(userId);
      }
      // Optionally: add notification for dislike (not typical for YouTube, so skip)
    }

    await updateDoc(commentRef, updates);
    return !isDisliked;
  } catch (error) {
    console.error('Error toggling comment dislike:', error);
    throw error;
  }
};

// Notifications functions
export const addNotification = async ({ userId, type, title, body, discussionId, commentId }) => {
  try {
    return await addDoc(notificationsRef, {
      userId,
      type,
      title,
      body,
      discussionId,
      commentId,
      createdAt: serverTimestamp(),
      read: false
    });
  } catch (error) {
    console.error('Error adding notification:', error);
    throw error;
  }
};

export const getNotifications = async (userId) => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId)
      // Remove orderBy to avoid index requirements
    );
    const snapshot = await getDocs(q);
    let results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Client-side sorting by creation time (newest first)
    results.sort((a, b) => {
      const aTime = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
      const bTime = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
      return bTime - aTime;
    });
    
    return results;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, { read: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const subscribeToNotifications = (userId, callback) => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId)
      // Remove orderBy to avoid index requirements
    );
    
    return onSnapshot(q, snapshot => {
      let results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Client-side sorting by creation time (newest first)
      results.sort((a, b) => {
        const aTime = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
        const bTime = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
        return bTime - aTime;
      });
      
      callback(results);
    }, error => {
      console.error('Error in notifications subscription:', error);
      callback([]);
    });
  } catch (error) {
    console.error('Error setting up notifications subscription:', error);
    return () => {};
  }
};

export const editComment = async ({ commentId, newBody }) => {
  try {
    const commentRef = doc(db, 'comments', commentId);
    await updateDoc(commentRef, {
      body: newBody,
      editedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error editing comment:', error);
    throw error;
  }
};

export const deleteComment = async ({ commentId }) => {
  try {
    const commentRef = doc(db, 'comments', commentId);
    await deleteDoc(commentRef);
    // Optionally: handle deleting replies or marking as deleted
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}; 