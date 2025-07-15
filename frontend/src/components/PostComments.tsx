import { formatDistanceToNow } from "date-fns";
import { Edit2, MoreHorizontal, Send, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import type { PostComment } from "@/models/post";
import type { RootState } from "@/redux/store";
import {
	createComment,
	deleteComment,
	getComments,
	updateComment,
} from "@/services/PostService";

interface PostCommentsProps {
	postId: number;
}

export function PostComments({ postId }: PostCommentsProps) {
	const [comments, setComments] = useState<PostComment[]>([]);
	const [newComment, setNewComment] = useState("");
	const [editingComment, setEditingComment] = useState<number | null>(null);
	const [editContent, setEditContent] = useState("");
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");

	const currentUser = useSelector((state: RootState) => state.auth.user);

	// biome-ignore lint/correctness/useExhaustiveDependencies: ignore useEffect dependencies
	useEffect(() => {
		loadComments();
	}, [postId]);

	const loadComments = async () => {
		setLoading(true);
		setError("");
		try {
			const fetchedComments = await getComments(postId);
			setComments(fetchedComments);
		} catch (error) {
			console.error("Error loading comments:", error);
			setError("Failed to load comments");
		} finally {
			setLoading(false);
		}
	};

	const handleAddComment = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newComment.trim()) return;

		setSubmitting(true);
		setError("");
		try {
			const comment = await createComment(postId, {
				content: newComment.trim(),
			});
			setComments([...comments, comment]);
			setNewComment("");
		} catch (error) {
			console.error("Error adding comment:", error);
			setError("Failed to add comment");
		} finally {
			setSubmitting(false);
		}
	};

	const handleEditComment = async (commentId: number) => {
		if (!editContent.trim()) return;

		setSubmitting(true);
		setError("");
		try {
			await updateComment(commentId, { content: editContent.trim() });
			setComments(
				comments.map((comment) =>
					comment.postCommentId === commentId
						? {
								...comment,
								content: editContent.trim(),
								updatedAt: new Date().toISOString(),
							}
						: comment,
				),
			);
			setEditingComment(null);
			setEditContent("");
		} catch (error) {
			console.error("Error updating comment:", error);
			setError("Failed to update comment");
		} finally {
			setSubmitting(false);
		}
	};

	const handleDeleteComment = async (commentId: number) => {
		if (!confirm("Are you sure you want to delete this comment?")) return;

		try {
			await deleteComment(commentId);
			setComments(
				comments.filter((comment) => comment.postCommentId !== commentId),
			);
		} catch (error) {
			console.error("Error deleting comment:", error);
			setError("Failed to delete comment");
		}
	};

	const getInitials = (firstName?: string, lastName?: string) => {
		return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
	};

	if (loading) {
		return (
			<div className="space-y-4">
				{[...Array(2)].map((_, i) => (
					<div
						key={`skeleton-${i.toString()}`}
						className="animate-pulse flex space-x-3"
					>
						<div className="w-8 h-8 bg-gray-200 rounded-full"></div>
						<div className="flex-1 space-y-2">
							<div className="h-4 bg-gray-200 rounded w-24"></div>
							<div className="h-3 bg-gray-200 rounded w-full"></div>
						</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{error && (
				<div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
					{error}
				</div>
			)}

			{/* Add new comment form */}
			{currentUser && (
				<form onSubmit={handleAddComment} className="space-y-3">
					<div className="flex space-x-3">
						<Avatar className="w-8 h-8">
							<AvatarImage src={currentUser.profilePicture} />
							<AvatarFallback className="text-xs">
								{getInitials(currentUser.firstName, currentUser.lastName)}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1">
							<Textarea
								value={newComment}
								onChange={(e) => setNewComment(e.target.value)}
								placeholder="Write a comment..."
								rows={2}
								maxLength={1000}
								className="resize-none text-sm"
							/>
							<div className="flex justify-between items-center mt-2">
								<div className="text-xs text-muted-foreground">
									{newComment.length}/1000 characters
								</div>
								<Button
									type="submit"
									size="sm"
									disabled={!newComment.trim() || submitting}
								>
									<Send className="h-3 w-3 mr-1" />
									{submitting ? "Posting..." : "Comment"}
								</Button>
							</div>
						</div>
					</div>
				</form>
			)}

			{/* Comments list */}
			<div className="space-y-4">
				{comments.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground">
						<p>No comments yet. Be the first to comment!</p>
					</div>
				) : (
					comments.map((comment) => {
						const isOwnComment = currentUser?.userId === comment.userId;
						const isEditing = editingComment === comment.postCommentId;

						return (
							<div key={comment.postCommentId} className="flex space-x-3">
								<Avatar className="w-8 h-8">
									<AvatarImage src={comment.userProfilePicture} />
									<AvatarFallback className="text-xs">
										{getInitials(comment.userFirstName, comment.userLastName)}
									</AvatarFallback>
								</Avatar>

								<div className="flex-1 min-w-0">
									<div className="flex items-center space-x-2 mb-1">
										<Link
											to={`/profile/${comment.userId}`}
											className="font-medium text-sm hover:underline hover:text-primary transition-colors"
										>
											{comment.userFirstName} {comment.userLastName}
										</Link>
										<span className="text-xs text-muted-foreground">
											{formatDistanceToNow(new Date(comment.createdAt), {
												addSuffix: true,
											})}
										</span>
										{comment.updatedAt && (
											<span className="text-xs text-muted-foreground">
												• Edited
											</span>
										)}
									</div>

									{isEditing ? (
										<div className="space-y-2">
											<Textarea
												value={editContent}
												onChange={(e) => setEditContent(e.target.value)}
												rows={2}
												maxLength={1000}
												className="resize-none text-sm"
											/>
											<div className="flex justify-between items-center">
												<div className="text-xs text-muted-foreground">
													{editContent.length}/1000 characters
												</div>
												<div className="flex space-x-2">
													<Button
														size="sm"
														variant="outline"
														onClick={() => {
															setEditingComment(null);
															setEditContent("");
														}}
														disabled={submitting}
													>
														Cancel
													</Button>
													<Button
														size="sm"
														onClick={() =>
															handleEditComment(comment.postCommentId)
														}
														disabled={!editContent.trim() || submitting}
													>
														{submitting ? "Saving..." : "Save"}
													</Button>
												</div>
											</div>
										</div>
									) : (
										<div className="flex items-start justify-between">
											<p className="text-sm whitespace-pre-wrap flex-1 pr-2">
												{comment.content}
											</p>

											{isOwnComment && (
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant="ghost"
															size="sm"
															className="h-6 w-6 p-0"
														>
															<MoreHorizontal className="h-3 w-3" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem
															onClick={() => {
																setEditingComment(comment.postCommentId);
																setEditContent(comment.content);
															}}
														>
															<Edit2 className="h-3 w-3 mr-2" />
															Edit
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() =>
																handleDeleteComment(comment.postCommentId)
															}
															className="text-destructive"
														>
															<Trash2 className="h-3 w-3 mr-2" />
															Delete
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											)}
										</div>
									)}
								</div>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
}
