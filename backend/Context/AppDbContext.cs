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
                entity.HasOne(e => e.User)
                    .WithMany(u => u.Trips)
                    .HasForeignKey(e => e.UserId);
            });

            // Configure ItineraryItem entity
            modelBuilder.Entity<ItineraryItem>(entity =>
            {
                entity.HasKey(e => e.ItineraryItemId);
                entity.Property(e => e.Name).IsRequired();
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

        }
    }
}