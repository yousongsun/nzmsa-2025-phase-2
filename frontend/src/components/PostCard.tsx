import { formatDistanceToNow } from "date-fns";
import {
	Edit,
	Heart,
	MapPin,
	MessageCircle,
	MoreHorizontal,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { EditPostForm } from "@/components/EditPostForm";
import { PostComments } from "@/components/PostComments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Post } from "@/models/post";
import { PostPrivacy } from "@/models/post";
import type { RootState } from "@/redux/store";
import { likePost, unlikePost } from "@/services/PostService";

interface PostCardProps {
	post: Post;
	onPostDeleted?: (postId: number) => void;
	onPostUpdated?: (post: Post) => void;
}

export function PostCard({
	post,
	onPostDeleted,
	onPostUpdated,
}: PostCardProps) {
	const [isLiked, setIsLiked] = useState(false);
	const [likeCount, setLikeCount] = useState(post.likeCount);
	const [showComments, setShowComments] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [loading, setLoading] = useState(false);
	const [currentPost, setCurrentPost] = useState(post);

	const currentUser = useSelector((state: RootState) => state.auth.user);
	const isOwnPost = currentUser?.userId === post.userId;

	// Check if current user has liked the post
	useState(() => {
		if (currentUser && post.likes) {
			setIsLiked(post.likes.some((like) => like.userId === currentUser.userId));
		}
	});

	const handleLike = async () => {
		if (!currentUser) return;

		setLoading(true);
		try {
			if (isLiked) {
				await unlikePost(post.postId);
				setIsLiked(false);
				setLikeCount((prev) => prev - 1);
			} else {
				await likePost(post.postId);
				setIsLiked(true);
				setLikeCount((prev) => prev + 1);
			}
		} catch (error) {
			console.error("Error toggling like:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async () => {
		if (onPostDeleted) {
			onPostDeleted(post.postId);
		}
		setShowDeleteDialog(false);
	};

	const handlePostUpdated = (updatedPost: Post) => {
		setCurrentPost(updatedPost);
		setShowEditDialog(false);
		if (onPostUpdated) {
			onPostUpdated(updatedPost);
		}
	};

	const getPrivacyBadge = (privacy: PostPrivacy) => {
		switch (privacy) {
			case PostPrivacy.Public:
				return <Badge variant="secondary">Public</Badge>;
			case PostPrivacy.FollowersOnly:
				return <Badge variant="outline">Followers Only</Badge>;
			case PostPrivacy.Private:
				return <Badge variant="destructive">Private</Badge>;
			default:
				return null;
		}
	};

	const getInitials = (firstName?: string, lastName?: string) => {
		return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
	};

	return (
		<Card className="w-full max-w-2xl mx-auto mb-4">
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div className="flex items-center space-x-3">
						<Avatar>
							<AvatarImage src={currentPost.userProfilePicture} />
							<AvatarFallback>
								{getInitials(
									currentPost.userFirstName,
									currentPost.userLastName,
								)}
							</AvatarFallback>
						</Avatar>
						<div>
							<div className="flex items-center space-x-2">
								<Link
									to={`/profile/${currentPost.userId}`}
									className="font-semibold hover:underline hover:text-primary transition-colors"
								>
									{currentPost.userFirstName} {currentPost.userLastName}
								</Link>
								{getPrivacyBadge(currentPost.privacy)}
							</div>
							<div className="flex items-center space-x-2 text-sm text-muted-foreground">
								<span>
									{formatDistanceToNow(new Date(currentPost.createdAt), {
										addSuffix: true,
									})}
								</span>
								{currentPost.updatedAt && <span>• Edited</span>}
								{currentPost.tripName && (
									<div className="flex items-center space-x-1">
										<MapPin className="h-3 w-3" />
										<span>{currentPost.tripName}</span>
									</div>
								)}
							</div>
						</div>
					</div>

					{isOwnPost && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm">
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={() => setShowEditDialog(true)}>
									<Edit className="h-4 w-4 mr-2" />
									Edit Post
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => setShowDeleteDialog(true)}
									className="text-destructive"
								>
									<Trash2 className="h-4 w-4 mr-2" />
									Delete Post
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				{/* Post content */}
				<div className="prose prose-sm max-w-none">
					<p className="whitespace-pre-wrap">{currentPost.content}</p>
				</div>

				{/* Post image */}
				{currentPost.imageUrl && (
					<div className="rounded-lg overflow-hidden">
						<img
							src={`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5042"}${currentPost.imageUrl}`}
							alt={currentPost.imageAltText || "Post image"}
							className="w-full h-auto object-cover max-h-96"
						/>
					</div>
				)}

				{/* Action buttons */}
				<div className="flex items-center justify-between pt-2 border-t">
					<div className="flex items-center space-x-4">
						<Button
							variant="ghost"
							size="sm"
							onClick={handleLike}
							disabled={loading || !currentUser}
							className={isLiked ? "text-red-500" : ""}
						>
							<Heart
								className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`}
							/>
							{likeCount}
						</Button>

						<Button
							variant="ghost"
							size="sm"
							onClick={() => setShowComments(!showComments)}
						>
							<MessageCircle className="h-4 w-4 mr-1" />
							{currentPost.commentCount}
						</Button>
					</div>
				</div>

				{/* Comments section */}
				{showComments && (
					<div className="pt-4 border-t">
						<PostComments postId={currentPost.postId} />
					</div>
				)}
			</CardContent>

			{/* Edit Post Dialog */}
			<Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
				<DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Edit Post</DialogTitle>
						<DialogDescription>
							Make changes to your post and save when you're done.
						</DialogDescription>
					</DialogHeader>
					<EditPostForm
						post={currentPost}
						onPostUpdated={handlePostUpdated}
						onCancel={() => setShowEditDialog(false)}
					/>
				</DialogContent>
			</Dialog>

			{/* Delete confirmation dialog */}
			<Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Post</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this post? This action cannot be
							undone.
						</DialogDescription>
					</DialogHeader>
					<div className="flex justify-end space-x-2 mt-4">
						<Button
							variant="outline"
							onClick={() => setShowDeleteDialog(false)}
						>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleDelete}>
							Delete
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</Card>
	);
}
