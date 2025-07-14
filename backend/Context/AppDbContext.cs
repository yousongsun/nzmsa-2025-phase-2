using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Context
{
    public class AppDbContext : DbContext
    {

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Trip> Trips { get; set; } = null!;
        public DbSet<ItineraryItem> ItineraryItems { get; set; } = null!;
        public DbSet<SharedTrip> SharedTrips { get; set; } = null!;
        public DbSet<Follow> Follows { get; set; } = null!;
        public DbSet<TripInvite> TripInvites { get; set; } = null!;
        public DbSet<Post> Posts { get; set; } = null!;
        public DbSet<PostLike> PostLikes { get; set; } = null!;
        public DbSet<PostComment> PostComments { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Trip entity
            modelBuilder.Entity<Trip>(entity =>
            {
                entity.HasKey(e => e.TripId);
                entity.Property(e => e.Name).IsRequired();
                entity.Property(e => e.Destination).IsRequired();
                entity.Property(e => e.Latitude);
                entity.Property(e => e.Longitude);
                entity.HasOne(e => e.User)
                    .WithMany(u => u.Trips)
                    .HasForeignKey(e => e.UserId);
            });

            // Configure ItineraryItem entity
            modelBuilder.Entity<ItineraryItem>(entity =>
            {
                entity.HasKey(e => e.ItineraryItemId);
                entity.Property(e => e.Name).IsRequired();
                entity.Property(e => e.Type)
                      .HasConversion<string>();
                entity.Property(e => e.Address);
                entity.Property(e => e.Latitude);
                entity.Property(e => e.Longitude);
                entity.HasOne(e => e.Trip)
                    .WithMany(t => t.ItineraryItems)
                    .HasForeignKey(e => e.TripId);
            });

            // Configure SharedTrip entity
            modelBuilder.Entity<SharedTrip>(entity =>
            {
                entity.HasKey(e => e.SharedTripId);
                entity.HasOne(e => e.Trip)
                    .WithMany()
                    .HasForeignKey(e => e.TripId);
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId);
            });

            // Configure TripInvite entity
            modelBuilder.Entity<TripInvite>(entity =>
            {
                entity.HasKey(e => e.TripInviteId);
                entity.HasOne<Trip>()
                    .WithMany()
                    .HasForeignKey(e => e.TripId);
                entity.Property(e => e.Email).IsRequired();
            });

            // Configure Follow entity
            modelBuilder.Entity<Follow>(entity =>
            {
                entity.HasKey(e => e.FollowId);
                entity.HasOne(e => e.Follower)
                    .WithMany()
                    .HasForeignKey(e => e.FollowerId)
                    .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.Following)
                    .WithMany()
                    .HasForeignKey(e => e.FollowingId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure Post entity
            modelBuilder.Entity<Post>(entity =>
            {
                entity.HasKey(e => e.PostId);
                entity.Property(e => e.Content).IsRequired().HasMaxLength(2000);
                entity.Property(e => e.ImageUrl).HasMaxLength(1000);
                entity.Property(e => e.ImageAltText).HasMaxLength(500);
                entity.Property(e => e.Privacy)
                      .HasConversion<string>();
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.Trip)
                    .WithMany()
                    .HasForeignKey(e => e.TripId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Configure PostLike entity
            modelBuilder.Entity<PostLike>(entity =>
            {
                entity.HasKey(e => e.PostLikeId);
                entity.HasOne(e => e.Post)
                    .WithMany(p => p.Likes)
                    .HasForeignKey(e => e.PostId)
                    .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                // Ensure unique constraint - one like per user per post
                entity.HasIndex(e => new { e.PostId, e.UserId }).IsUnique();
            });

            // Configure PostComment entity
            modelBuilder.Entity<PostComment>(entity =>
            {
                entity.HasKey(e => e.PostCommentId);
                entity.Property(e => e.Content).IsRequired().HasMaxLength(1000);
                entity.HasOne(e => e.Post)
                    .WithMany(p => p.Comments)
                    .HasForeignKey(e => e.PostId)
                    .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}