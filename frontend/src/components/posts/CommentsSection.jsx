import { useEffect, useRef, useState } from 'react';
import {
  createComment,
  deleteComment,
  getPostComments,
  replyToComment,
  updateComment,
} from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

/* ─── Single Comment Card ─────────────────────────────────────── */
function CommentCard({ comment, postId, onRefresh, depth = 0, parentAuthorName = null }) {
  const { user } = useAuth();
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [editLoading, setEditLoading] = useState(false);

  const isOwner =
    Boolean(user?.id) &&
    (user.id === comment.user?.id || user.id === comment.userId || user.role === 'ADMIN');
  const isDeleted = comment.isDeleted || comment.is_deleted;

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setReplyLoading(true);
    try {
      await replyToComment(comment.id, replyText.trim());
      setReplyText('');
      setShowReply(false);
      onRefresh();
    } catch (err) {
      console.error('Failed to reply:', err);
      alert(err.response?.data?.message || 'Failed to post reply.');
    } finally {
      setReplyLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editText.trim()) return;
    setEditLoading(true);
    try {
      await updateComment(comment.id, editText.trim());
      setEditing(false);
      onRefresh();
    } catch (err) {
      console.error('Failed to edit comment:', err);
      alert(err.response?.data?.message || 'Failed to update comment.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await deleteComment(comment.id);
      if (depth === 0) {
        window.dispatchEvent(
          new CustomEvent('post-comment-updated', {
            detail: { postId: comment.postId, commentsCountDelta: -1 },
          })
        );
      }
      onRefresh();
    } catch (err) {
      console.error('Failed to delete comment:', err);
      alert(err.response?.data?.message || 'Failed to delete comment.');
    }
  };

  const authorName = comment.user?.fullName || comment.user?.username || 'Anonymous';
  const authorInitial = authorName.charAt(0).toUpperCase();
  const formattedDate = comment.createdAt || comment.created_at
    ? new Date(comment.createdAt || comment.created_at).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      })
    : '';

  // depth 0 = top-level comment (no indent)
  // depth 1 = first reply (indent once)
  // depth 2+ = reply-to-reply (cancel parent's avatar+gap offset so it aligns WITH depth-1, not further right)
  //   The parent (depth-1) avatar is w-7 (28px) + flex gap-3 (12px) = 40px = -ml-10
  const indentClass = depth === 0
    ? 'mt-4'
    : depth === 1
      ? 'ml-6 sm:ml-8 mt-3'
      : '-ml-10 mt-2'; // pull back to same visual column as depth-1

  return (
    <div className={`flex gap-3 ${indentClass}`}>
      {/* Avatar — slightly smaller for replies */}
      <div className={`flex-shrink-0 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-sm ${depth === 0 ? 'w-8 h-8 text-xs' : 'w-7 h-7 text-[10px]'}`}>
        {comment.user?.avatar
          ? <img src={comment.user.avatar} alt={authorName} className="w-full h-full rounded-full object-cover" />
          : authorInitial}
      </div>

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-semibold text-slate-200 ${depth === 0 ? 'text-sm' : 'text-xs'}`}>{authorName}</span>
          <span className="text-[11px] text-slate-500">{formattedDate}</span>
          {depth > 0 && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              reply
            </span>
          )}
        </div>

        {/* Body */}
        {isDeleted ? (
          <p className="mt-1 text-sm text-slate-500 italic">[This comment was deleted]</p>
        ) : editing ? (
          <div className="mt-2 space-y-2">
            <textarea
              rows={2}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500/60 resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                disabled={editLoading}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                {editLoading ? 'Saving…' : 'Save'}
              </button>
              <button
                onClick={() => { setEditing(false); setEditText(comment.content); }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-1 text-sm text-slate-300 leading-relaxed">
            {/* Show @mention only for depth >= 2 (reply-to-reply), not for depth 1 (simple reply) */}
            {parentAuthorName && depth >= 2 && (
              <span className="inline-flex items-center gap-0.5 text-indigo-400 font-semibold mr-1.5 bg-indigo-500/10 px-1.5 py-0.5 rounded text-xs">
                @{parentAuthorName}
              </span>
            )}
            {comment.content}
          </p>
        )}

        {/* Actions */}
        {!isDeleted && !editing && (
          <div className="flex items-center gap-3 mt-2">
            {user && (
              <button
                onClick={() => setShowReply((v) => !v)}
                className="text-xs text-slate-500 hover:text-indigo-400 font-medium transition-colors"
              >
                {showReply ? 'Cancel' : '↩ Reply'}
              </button>
            )}
            {isOwner && (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs text-slate-500 hover:text-amber-400 font-medium transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="text-xs text-slate-500 hover:text-rose-400 font-medium transition-colors"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        )}

        {/* Reply Input */}
        {showReply && (
          <div className="mt-3 flex gap-2">
            <textarea
              rows={2}
              placeholder={`Replying to @${authorName}…`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 resize-none"
            />
            <button
              onClick={handleReply}
              disabled={replyLoading || !replyText.trim()}
              className="self-end px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 transition-colors shadow-md"
            >
              {replyLoading ? '…' : 'Post'}
            </button>
          </div>
        )}

        {/* Nested Replies — only show border-l on the first indent level */}
        {comment.replies?.length > 0 && (
          <div className={`mt-1 ${depth === 0 ? 'border-l-2 border-slate-800/70 pl-1' : ''}`}>
            {comment.replies.map((reply) => (
              <CommentCard
                key={reply.id}
                comment={reply}
                postId={postId}
                onRefresh={onRefresh}
                depth={depth + 1}
                parentAuthorName={authorName}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Comments Section ────────────────────────────────────────── */
export default function CommentsSection({ postId, onCountChange, sectionRef }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [posting, setPosting] = useState(false);

  const loadComments = async () => {
    try {
      const data = await getPostComments(postId);
      setComments(data);
      onCountChange?.(data.length);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (postId) loadComments();
  }, [postId]);

  const handlePost = async () => {
    if (!newComment.trim()) return;
    setPosting(true);
    try {
      await createComment(postId, newComment.trim());
      setNewComment('');
      window.dispatchEvent(
        new CustomEvent('post-comment-updated', {
          detail: { postId, commentsCountDelta: 1 },
        })
      );
      await loadComments();
    } catch { /* ignore */ }
    finally { setPosting(false); }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handlePost();
  };

  return (
    <section ref={sectionRef} className="pt-10 border-t border-slate-800 space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <h3 className="text-xl font-bold text-slate-100">Comments</h3>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          {comments.length}
        </span>
      </div>

      {/* New Comment Input */}
      {user ? (
        <div className="flex gap-3">
          {/* Current User Avatar */}
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
            {user.fullName?.charAt(0) || user.username?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 space-y-2">
            <textarea
              rows={3}
              placeholder="Share your thoughts… (Ctrl+Enter to post)"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 resize-none transition-colors"
            />
            <div className="flex justify-end">
              <button
                onClick={handlePost}
                disabled={posting || !newComment.trim()}
                className="px-5 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 transition-all shadow-lg shadow-indigo-600/20"
              >
                {posting ? 'Posting…' : 'Post Comment'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center text-sm text-slate-400">
          <span className="text-indigo-400 font-semibold">Sign in</span> to join the conversation.
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex-shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 w-32 bg-slate-800 rounded" />
                <div className="h-3 w-full bg-slate-800 rounded" />
                <div className="h-3 w-2/3 bg-slate-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="py-10 text-center text-slate-500 text-sm">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-1 divide-y divide-slate-800/60">
          {comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              postId={postId}
              onRefresh={loadComments}
              depth={0}
            />
          ))}
        </div>
      )}
    </section>
  );
}
