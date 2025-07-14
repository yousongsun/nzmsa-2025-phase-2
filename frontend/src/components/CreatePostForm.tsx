import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type CreatePostRequest, PostPrivacy } from "@/models/post";
import { createPost } from "@/services/PostService";

interface CreatePostFormProps {
	onPostCreated?: (success: boolean) => void;
}

export function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!content.trim()) {
			setError("Post content is required");
			return;
		}

		setLoading(true);
		setError("");

		try {
			const postData: CreatePostRequest = {
				content: content.trim(),
				privacy: PostPrivacy.Public,
			};

			await createPost(postData);

			// Reset form
			setContent("");

			if (onPostCreated) {
				onPostCreated(true);
			}
		} catch (error) {
			console.error("Error creating post:", error);
			setError("Failed to create post. Please try again.");
			if (onPostCreated) {
				onPostCreated(false);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle>Create New Post</CardTitle>
			</CardHeader>

			<form onSubmit={handleSubmit}>
				<CardContent className="space-y-4">
					{error && (
						<div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
							{error}
						</div>
					)}

					{/* Content */}
					<div className="space-y-2">
						<Label htmlFor="content">What's on your mind?</Label>
						<Textarea
							id="content"
							placeholder="Share your thoughts, experiences, or travel stories..."
							value={content}
							onChange={(e) => setContent(e.target.value)}
							rows={4}
							maxLength={2000}
							className="resize-none"
						/>
						<div className="text-xs text-muted-foreground text-right">
							{content.length}/2000 characters
						</div>
					</div>
				</CardContent>

				<CardFooter className="flex justify-between">
					<div className="text-sm text-muted-foreground">
						Public post - everyone can see this
					</div>

					<div className="flex space-x-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								setContent("");
								setError("");
							}}
							disabled={loading}
						>
							Clear
						</Button>
						<Button type="submit" disabled={loading || !content.trim()}>
							{loading ? "Posting..." : "Create Post"}
						</Button>
					</div>
				</CardFooter>
			</form>
		</Card>
	);
}
