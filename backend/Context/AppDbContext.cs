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
        }
    }
}