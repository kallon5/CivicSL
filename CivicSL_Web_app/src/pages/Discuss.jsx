import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faComments, 
  faPlus, 
  faSearch, 
  faTimes, 
  faHeart, 
  faReply,
  faChevronDown,
  faChevronUp,
  faThumbsDown
} from '@fortawesome/free-solid-svg-icons';
import { 
  getDiscussions, 
  addDiscussion, 
  subscribeToDiscussions,
  addComment,
  subscribeToComments,
  toggleLike,
  toggleCommentLike,
  toggleCommentDislike,
  editComment,
  deleteComment
} from '../services/discussService';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from '../components/NotificationBell';
import './shared.css';

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'general', label: 'General Discussion' },
  { value: 'rights', label: 'Civic Rights' },
  { value: 'government', label: 'Government' },
  { value: 'elections', label: 'Elections' },
  { value: 'community', label: 'Community' },
  { value: 'questions', label: 'Questions' },
];
const sortOptions = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'active', label: 'Most Active' },
];

// Helper for relative time
function getRelativeTime(date) {
  if (!date) return '';
  const now = new Date();
  const diff = (now - date) / 1000;
  if (diff < 60) return `${Math.floor(diff)} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
  return date.toLocaleString();
}

function Discuss() {
  const { currentUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('recent');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ category: '', title: '', body: '' });
  const [posting, setPosting] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [commentForms, setCommentForms] = useState({});
  const [comments, setComments] = useState({});
  const [postingComment, setPostingComment] = useState({});
  const [activeReplyCommentId, setActiveReplyCommentId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [loadingAction, setLoadingAction] = useState({});
  const [errorAction, setErrorAction] = useState({});
  const replyInputRef = useRef(null);
  const editInputRef = useRef(null);
  const [collapsedReplies, setCollapsedReplies] = useState({});

  // Real-time Firestore subscription
  useEffect(() => {
    setLoading(true);
    const unsub = subscribeToDiscussions(
      (data) => {
        setDiscussions(data);
        setLoading(false);
      },
      { category, sort }
    );
    return () => unsub();
  }, [category, sort]);

  // Search filter (client-side)
  const filteredDiscussions = discussions.filter(d =>
    (!search || d.title?.toLowerCase().includes(search.toLowerCase()) || d.body?.toLowerCase().includes(search.toLowerCase()))
  );

  // Modal form handlers
  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setForm({ category: '', title: '', body: '' });
  };
  const handleFormChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.category || !form.title || !form.body) return;
    setPosting(true);
    try {
      await addDiscussion({ ...form, user: currentUser });
      closeModal();
    } finally {
      setPosting(false);
    }
  };

  // Comment handlers
  const toggleComments = (discussionId) => {
    setExpandedComments(prev => ({
      ...prev,
      [discussionId]: !prev[discussionId]
    }));
    
    // Load comments if not already loaded
    if (!comments[discussionId]) {
      const unsub = subscribeToComments(discussionId, (data) => {
        setComments(prev => ({ ...prev, [discussionId]: data }));
      });
      // Store unsubscribe function for cleanup
      return () => unsub();
    }
  };

  const handleCommentSubmit = async (discussionId, e) => {
    e.preventDefault();
    const commentBody = commentForms[discussionId];
    if (!commentBody?.trim()) return;
    setLoadingAction(a => ({ ...a, [discussionId]: 'posting' }));
    setErrorAction(a => ({ ...a, [discussionId]: null }));
    try {
      await addComment({ discussionId, body: commentBody, user: currentUser });
      setCommentForms(prev => ({ ...prev, [discussionId]: '' }));
    } catch (err) {
      setErrorAction(a => ({ ...a, [discussionId]: 'Failed to post comment.' }));
    } finally {
      setLoadingAction(a => ({ ...a, [discussionId]: null }));
    }
  };

  const handleCommentChange = (discussionId, value) => {
    setCommentForms(prev => ({ ...prev, [discussionId]: value }));
  };

  // Like handlers
  const handleLike = async (discussionId) => {
    if (!currentUser) return;
    await toggleLike({ 
      discussionId, 
      userId: currentUser.uid, 
      userName: currentUser.displayName || 'Anonymous' 
    });
  };

  const handleCommentLike = async (commentId) => {
    if (!currentUser) return;
    await toggleCommentLike({ 
      commentId, 
      userId: currentUser.uid, 
      userName: currentUser.displayName || 'Anonymous' 
    });
  };

  const handleCommentDislike = async (commentId) => {
    if (!currentUser) return;
    await toggleCommentDislike({ 
      commentId, 
      userId: currentUser.uid, 
      userName: currentUser.displayName || 'Anonymous' 
    });
  };

  const isLiked = (discussion) => {
    return currentUser && discussion.likedBy?.includes(currentUser.uid);
  };

  const isCommentLiked = (comment) => {
    return currentUser && comment.likedBy?.includes(currentUser.uid);
  };

  const isCommentDisliked = (comment) => {
    return currentUser && comment.dislikedBy?.includes(currentUser.uid);
  };

  // Add effect to close reply input when clicking outside
  useEffect(() => {
    if (!activeReplyCommentId) return;
    const handleClick = (e) => {
      if (!e.target.closest('.reply-form')) {
        setActiveReplyCommentId(null);
        setReplyText('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [activeReplyCommentId]);

  // Update handleReplySubmit
  const handleReplySubmit = async (discussionId, parentCommentId, e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      await addComment({ discussionId, body: replyText, user: currentUser, parentCommentId });
      setReplyText('');
      setActiveReplyCommentId(null);
    } catch {}
  };

  const handleEditClick = (comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.body);
  };

  const handleEditSave = async (commentId) => {
    if (!editText.trim()) return;
    setLoadingAction(a => ({ ...a, [commentId]: 'editing' }));
    setErrorAction(a => ({ ...a, [commentId]: null }));
    try {
      await editComment({ commentId, newBody: editText });
      setEditingCommentId(null);
      setEditText('');
    } catch (err) {
      setErrorAction(a => ({ ...a, [commentId]: 'Failed to edit comment.' }));
    } finally {
      setLoadingAction(a => ({ ...a, [commentId]: null }));
    }
  };

  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditText('');
  };

  const handleDeleteClick = (commentId) => {
    setDeletingCommentId(commentId);
  };

  const handleDeleteConfirm = async (commentId) => {
    setLoadingAction(a => ({ ...a, [commentId]: 'deleting' }));
    setErrorAction(a => ({ ...a, [commentId]: null }));
    try {
      // Soft delete: set body to null, add deleted flag
      await editComment({ commentId, newBody: null });
    } catch (err) {
      setErrorAction(a => ({ ...a, [commentId]: 'Failed to delete comment.' }));
    } finally {
      setLoadingAction(a => ({ ...a, [commentId]: null }));
      setDeletingCommentId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeletingCommentId(null);
  };

  // Focus reply/edit textarea when opened
  useEffect(() => {
    if (activeReplyCommentId && replyInputRef.current) replyInputRef.current.focus();
  }, [activeReplyCommentId]);
  useEffect(() => {
    if (editingCommentId && editInputRef.current) editInputRef.current.focus();
  }, [editingCommentId]);

  // In the comments list, group comments by parentCommentId and render replies indented
  const renderComments = (commentsArr, discussionId, parentId = null, level = 0) => {
    if (level > 1) return null; // Limit nesting to 2 levels
    return commentsArr
      .filter(comment => comment.parentCommentId === parentId && comment.body !== null) // Only show non-deleted
      .map(comment => {
        const isOwnComment = currentUser && comment.user?.uid === comment.user?.uid;
        const replies = commentsArr.filter(c => c.parentCommentId === comment.id);
        // Avatar logic
        let avatar;
        if (comment.user?.photoURL) {
          avatar = <img src={comment.user.photoURL} alt="avatar" className="discuss-comment-avatar-img" />;
        } else {
          const color = isOwnComment ? '#1976d2' : '#888';
          avatar = <div className="discuss-comment-avatar-initial" style={{ background: color }}>
            {(comment.user?.name || 'A').charAt(0).toUpperCase()}
          </div>;
        }
        // Collapsed state for replies
        const isCollapsed = collapsedReplies[comment.id] || false;
        const toggleCollapsed = () => setCollapsedReplies(prev => ({ ...prev, [comment.id]: !isCollapsed }));
        return (
          <div key={comment.id} className={`discuss-comment${isOwnComment ? ' own' : ''}`} style={{ marginLeft: level * 24 }}>
            <div className="discuss-comment-avatar">{avatar}</div>
          <div className="discuss-comment-content">
            <div className="discuss-comment-header">
              <span className="discuss-comment-user">{comment.user?.name || 'Anonymous'}</span>
              <span className="discuss-comment-date">
                  {comment.createdAt?.toDate ? getRelativeTime(comment.createdAt.toDate()) : ''}
                  {comment.editedAt && <span className="discuss-comment-edited"> (edited)</span>}
              </span>
            </div>
              {editingCommentId === comment.id ? (
                <div className="discuss-comment-edit-form">
                  <textarea
                    ref={editInputRef}
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    className="discuss-comment-input"
                    rows={2}
                    aria-label="Edit comment"
                    onKeyDown={e => {
                      if (e.key === 'Escape') handleEditCancel();
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleEditSave(comment.id); }
                    }}
                  />
                  <div className="discuss-comment-form-actions">
                    <button className="discuss-comment-btn" onClick={handleEditCancel} aria-label="Cancel edit">Cancel</button>
                    <button className="discuss-comment-btn primary" onClick={() => handleEditSave(comment.id)} disabled={!editText.trim() || loadingAction[comment.id] === 'editing'} aria-label="Save edit">{loadingAction[comment.id] === 'editing' ? 'Saving...' : 'Save'}</button>
                  </div>
                  {errorAction[comment.id] && <div className="discuss-comment-error">{errorAction[comment.id]}</div>}
                </div>
              ) : (
            <p className="discuss-comment-body">{comment.body}</p>
              )}
            <div className="discuss-comment-actions">
              <button 
                className={`discuss-comment-action-btn ${isCommentLiked(comment) ? 'liked' : ''}`}
                onClick={() => handleCommentLike(comment.id)}
                  disabled={!currentUser || isCommentDisliked(comment) || loadingAction[comment.id]}
                  aria-label="Like comment"
              >
                <FontAwesomeIcon icon={faHeart} />
                <span>{comment.likesCount || 0}</span>
              </button>
                <button
                  className={`discuss-comment-action-btn ${isCommentDisliked(comment) ? 'disliked' : ''}`}
                  onClick={() => handleCommentDislike(comment.id)}
                  disabled={!currentUser || isCommentLiked(comment) || loadingAction[comment.id]}
                  aria-label="Dislike comment"
                >
                  <FontAwesomeIcon icon={faThumbsDown} />
                  <span>{comment.dislikesCount || 0}</span>
                </button>
                <button className="discuss-comment-action-btn" onClick={() => { setActiveReplyCommentId(comment.id); setReplyText(''); }} aria-label="Reply to comment">
                <FontAwesomeIcon icon={faReply} />
                <span>Reply</span>
              </button>
                {isOwnComment && editingCommentId !== comment.id && (
                  <>
                    <button className="discuss-comment-action-btn" onClick={() => handleEditClick(comment)} aria-label="Edit comment">Edit</button>
                    <button className="discuss-comment-action-btn" onClick={() => handleDeleteClick(comment.id)} aria-label="Delete comment">Delete</button>
                  </>
                )}
              </div>
              {/* Delete confirmation dialog */}
              {deletingCommentId === comment.id && (
                <div className="discuss-comment-delete-confirm">
                  <span>Are you sure you want to delete this comment?</span>
                  <button className="discuss-comment-btn" onClick={handleDeleteCancel} aria-label="Cancel delete">Cancel</button>
                  <button className="discuss-comment-btn danger" onClick={() => handleDeleteConfirm(comment.id)} disabled={loadingAction[comment.id] === 'deleting'} aria-label="Confirm delete">{loadingAction[comment.id] === 'deleting' ? 'Deleting...' : 'Delete'}</button>
                  {errorAction[comment.id] && <div className="discuss-comment-error">{errorAction[comment.id]}</div>}
            </div>
              )}
            {/* Reply input only for the active comment */}
            {activeReplyCommentId === comment.id && (
              <form onSubmit={e => handleReplySubmit(discussionId, comment.id, e)} className="discuss-comment-form reply-form" style={{ marginTop: 8 }}>
                <textarea
                    ref={replyInputRef}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="discuss-comment-input"
                  rows={1}
                    aria-label="Reply to comment"
                    onKeyDown={e => {
                      if (e.key === 'Escape') { setActiveReplyCommentId(null); setReplyText(''); }
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReplySubmit(discussionId, comment.id, e); }
                    }}
                  autoFocus
                />
                <div className="discuss-comment-form-actions">
                    <button type="button" className="discuss-comment-btn" onClick={() => { setActiveReplyCommentId(null); setReplyText(''); }} aria-label="Cancel reply">Cancel</button>
                    <button type="submit" className="discuss-comment-btn primary" disabled={!replyText.trim() || loadingAction[comment.id] === 'replying'} aria-label="Submit reply">{loadingAction[comment.id] === 'replying' ? 'Replying...' : 'Reply'}</button>
                  </div>
                  {errorAction[comment.id] && <div className="discuss-comment-error">{errorAction[comment.id]}</div>}
                </form>
              )}
              {/* Replies: collapse/expand if more than 2 */}
              {replies.length > 0 && (
                <div className="discuss-comment-replies">
                  <button className="discuss-comment-replies-toggle" onClick={toggleCollapsed} aria-label={isCollapsed ? 'Expand replies' : 'Collapse replies'}>
                    {isCollapsed
                      ? `Show ${replies.length} repl${replies.length === 1 ? 'y' : 'ies'}`
                      : `Hide replies (${replies.length})`}
                  </button>
                  {!isCollapsed && renderComments(commentsArr, discussionId, comment.id, level + 1)}
                </div>
            )}
            </div>
          </div>
        );
      });
  };

  return (
    <div className="discuss">
      <div className="discuss-container">
        {/* Header */}
        <div className="discuss-header-row">
          <div>
            <h1 className="discuss-title">Community Discussions</h1>
            <p className="discuss-subtitle">Share thoughts, ask questions, and engage with the CivicSL community</p>
          </div>
          <div className="discuss-header-actions">
            <NotificationBell />
            <button className="discuss-btn-primary" onClick={openModal}>
              <FontAwesomeIcon icon={faPlus} className="mr-2" /> New Discussion
            </button>
          </div>
        </div>
        {/* Filters */}
        <div className="discuss-filters">
          <div className="discuss-search-wrap">
            <FontAwesomeIcon icon={faSearch} className="discuss-search-icon" />
            <input
              type="text"
              placeholder="Search discussions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="discuss-search-input"
            />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)} className="discuss-select">
            {categories.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} className="discuss-select">
            {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        {/* Modal */}
        {showModal && (
          <div className="discuss-modal-overlay" onClick={closeModal}>
            <div className="discuss-modal" onClick={e => e.stopPropagation()}>
              <div className="discuss-modal-header">
                <h2>Start a New Discussion</h2>
                <button className="discuss-modal-close" onClick={closeModal}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleFormChange} required className="discuss-select w-full mb-3">
                  <option value="">Select a category</option>
                  {categories.filter(c => c.value).map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <label>Title</label>
                <input name="title" value={form.title} onChange={handleFormChange} required className="discuss-input w-full mb-3" placeholder="Enter discussion title..." />
                <label>Content</label>
                <textarea name="body" value={form.body} onChange={handleFormChange} required className="discuss-input w-full mb-4" rows={5} placeholder="Share your thoughts, questions, or ideas..." />
                <div className="discuss-modal-actions">
                  <button type="button" className="discuss-btn" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="discuss-btn-primary" disabled={posting}>{posting ? 'Posting...' : 'Post Discussion'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Threads */}
        <div className="discuss-threads">
          {loading ? (
            <div className="discuss-empty"><span>Loading discussions...</span></div>
          ) : filteredDiscussions.length === 0 ? (
            <div className="discuss-empty">
              <FontAwesomeIcon icon={faComments} className="discuss-empty-icon" />
              <h3>No discussions yet</h3>
              <p>Be the first to start a discussion!</p>
              <button className="discuss-btn-primary" onClick={openModal}>Start Discussion</button>
            </div>
          ) : (
            filteredDiscussions.map(disc => (
              <div key={disc.id} className="discuss-thread">
                <div className="discuss-thread-header">
                  <span className={`discuss-tag discuss-tag-${disc.category}`}>{categories.find(c => c.value === disc.category)?.label || 'Other'}</span>
                  <span className="discuss-thread-user">{disc.user?.name || 'Anonymous'}</span>
                  <span className="discuss-thread-date">{disc.createdAt?.toDate ? disc.createdAt.toDate().toLocaleString() : ''}</span>
                </div>
                <h4 className="discuss-thread-title">{disc.title}</h4>
                <p className="discuss-thread-body">{disc.body}</p>
                
                {/* Actions */}
                <div className="discuss-thread-actions">
                  <button 
                    className={`discuss-action-btn ${isLiked(disc) ? 'liked' : ''}`}
                    onClick={() => handleLike(disc.id)}
                    disabled={!currentUser}
                  >
                    <FontAwesomeIcon icon={faHeart} />
                    <span>{disc.likesCount || 0}</span>
                  </button>
                  <button 
                    className="discuss-action-btn"
                    onClick={() => toggleComments(disc.id)}
                  >
                    <FontAwesomeIcon icon={faComments} />
                    <span>{disc.commentsCount || 0}</span>
                  </button>
                </div>

                {/* Comments Section */}
                {expandedComments[disc.id] && (
                  <div className="discuss-comments-section">
                    {/* Comments Header */}
                    <div className="discuss-comments-header">
                      <span>Comments</span>
                      <span className="discuss-comments-count">({disc.commentsCount || 0})</span>
                    </div>
                    
                    {/* Add Comment */}
                    {currentUser && (
                      <form onSubmit={(e) => handleCommentSubmit(disc.id, e)} className="discuss-comment-form">
                        <div className="discuss-comment-avatar">
                          {(currentUser.displayName || currentUser.email || 'A').charAt(0).toUpperCase()}
                        </div>
                        <div className="discuss-comment-input-wrapper">
                          <textarea
                            value={commentForms[disc.id] || ''}
                            onChange={(e) => handleCommentChange(disc.id, e.target.value)}
                            placeholder="Add a comment..."
                            className="discuss-comment-input"
                            rows={1}
                          />
                          <div className="discuss-comment-form-actions">
                            <button 
                              type="button" 
                              className="discuss-comment-btn"
                              onClick={() => setCommentForms(prev => ({ ...prev, [disc.id]: '' }))}
                            >
                              Cancel
                            </button>
                            <button 
                              type="submit" 
                              className="discuss-comment-btn primary"
                              disabled={postingComment[disc.id] || !commentForms[disc.id]?.trim()}
                            >
                              {postingComment[disc.id] ? 'Posting...' : 'Comment'}
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                    
                    {/* Comments List */}
                    <div className="discuss-comments-list">
                      {renderComments(comments[disc.id] || [], disc.id)}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Discuss; 