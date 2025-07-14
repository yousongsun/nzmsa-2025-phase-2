import { Plus, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CreatePostForm } from "@/components/CreatePostForm";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { Post } from "@/models/post";
import type { RootState } from "@/redux/store";
import { deletePost, getPublicPosts } from "@/services/PostService";

export default function PostsPage() {
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [refreshing, setRefreshing] = useState(false);
	const [showCreateDialog, setShowCreateDialog] = useState(false);

	const isAuthenticated = useSelector(
		(state: RootState) => state.auth.isAuthenticated,
	);

	useEffect(() => {
		loadPosts();
	}, []);

	const loadPosts = async () => {
		setLoading(true);
		setError("");

		try {
			const fetchedPosts = await getPublicPosts({ page: 1, pageSize: 20 });
			setPosts(fetchedPosts);
		} catch (error) {
			console.error("Error loading posts:", error);
			setError("Failed to load posts. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleRefresh = async () => {
		setRefreshing(true);
		await loadPosts();
		setRefreshing(false);
	};

	const handlePostCreated = (success: boolean) => {
		if (success) {
			setShowCreateDialog(false);
			handleRefresh();
		}
	};

	// Removed handlePostUpdated since we simplified the PostCard component

	const handlePostDeleted = async (postId: number) => {
		try {
			await deletePost(postId);
			setPosts((currentPosts) =>
				currentPosts.filter((post) => post.postId !== postId),
			);
		} catch (error) {
			console.error("Error deleting post:", error);
			setError("Failed to delete post. Please try again.");
		}
	};

	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-3xl font-bold">Posts</h1>
					<p className="text-muted-foreground">
						Share your travel experiences and discover others' journeys
					</p>
				</div>

				<div className="flex items-center space-x-2">
					<Button
						onClick={handleRefresh}
						variant="outline"
						size="sm"
						disabled={refreshing}
					>
						<RefreshCw
							className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
						/>
						Refresh
					</Button>

					{isAuthenticated && (
						<Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
							<DialogTrigger asChild>
								<Button>
									<Plus className="h-4 w-4 mr-2" />
									Create Post
								</Button>
							</DialogTrigger>
							<DialogContent className="max-w-3xl">
								<DialogHeader>
									<DialogTitle>Create New Post</DialogTitle>
								</DialogHeader>
								<CreatePostForm onPostCreated={handlePostCreated} />
							</DialogContent>
						</Dialog>
					)}
				</div>
			</div>

			{error && (
				<div className="mb-6 p-4 text-red-600 bg-red-50 border border-red-200 rounded-md">
					{error}
					<Button
						onClick={handleRefresh}
						variant="outline"
						size="sm"
						className="ml-2"
					>
						Try Again
					</Button>
				</div>
			)}

			<div className="space-y-6">
				{loading ? (
					<div className="space-y-4">
						{[...Array(3)].map((_, i) => (
							<div key={`loading-${i}`} className="animate-pulse">
								<div className="bg-white rounded-lg border p-6">
									<div className="flex items-center space-x-3 mb-4">
										<div className="w-10 h-10 bg-gray-200 rounded-full"></div>
										<div className="space-y-2">
											<div className="h-4 bg-gray-200 rounded w-32"></div>
											<div className="h-3 bg-gray-200 rounded w-24"></div>
										</div>
									</div>
									<div className="space-y-2 mb-4">
										<div className="h-4 bg-gray-200 rounded w-full"></div>
										<div className="h-4 bg-gray-200 rounded w-3/4"></div>
									</div>
									<div className="h-32 bg-gray-200 rounded"></div>
								</div>
							</div>
						))}
					</div>
				) : posts.length === 0 ? (
					<div className="text-center py-12">
						<div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
							<Plus className="h-8 w-8 text-gray-400" />
						</div>
						<h3 className="text-lg font-semibold mb-2">No posts yet</h3>
						<p className="text-muted-foreground mb-4">
							Be the first to share something amazing!
						</p>
						{isAuthenticated && (
							<Button onClick={() => setShowCreateDialog(true)}>
								<Plus className="h-4 w-4 mr-2" />
								Create First Post
							</Button>
						)}
					</div>
				) : (
					posts.map((post) => (
						<PostCard
							key={post.postId}
							post={post}
							onPostDeleted={handlePostDeleted}
						/>
					))
				)}
			</div>
		</div>
	);
}
