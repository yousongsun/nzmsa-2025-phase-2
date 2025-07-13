using backend.Context;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public static class DbSeeder
    {
        public static async Task SeedDataAsync(AppDbContext context)
        {
            // Check if data already exists
            if (await context.Users.AnyAsync())
            {
                return; // Database has been seeded
            }

            // Seed Users
            var users = new List<User>
            {
                new User
                {
                    FirstName = "John",
                    LastName = "Doe",
                    Email = "john.doe@example.com",
                    Password = "password123", // This will be hashed by the repository
                    Description = "Adventure seeker and travel enthusiast"
                },
                new User
                {
                    FirstName = "Jane",
                    LastName = "Smith",
                    Email = "jane.smith@example.com",
                    Password = "password123",
                    Description = "Love exploring new cultures and cuisines"
                },
                new User
                {
                    FirstName = "Mike",
                    LastName = "Johnson",
                    Email = "mike.johnson@example.com",
                    Password = "password123",
                    Description = "Digital nomad and photographer"
                }
            };

            context.Users.AddRange(users);
            await context.SaveChangesAsync();

            // Seed Trips
            var trips = new List<Trip>
            {
                new Trip
                {
                    Name = "Tokyo Adventure",
                    Destination = "Tokyo, Japan",
                    StartDate = DateTime.Now.AddDays(30),
                    EndDate = DateTime.Now.AddDays(37),
                    UserId = users[0].UserId,
                    Latitude = 35.6762,
                    Longitude = 139.6503
                },
                new Trip
                {
                    Name = "European Tour",
                    Destination = "Paris, France",
                    StartDate = DateTime.Now.AddDays(60),
                    EndDate = DateTime.Now.AddDays(74),
                    UserId = users[1].UserId,
                    Latitude = 48.8566,
                    Longitude = 2.3522
                },
                new Trip
                {
                    Name = "Bali Retreat",
                    Destination = "Bali, Indonesia",
                    StartDate = DateTime.Now.AddDays(15),
                    EndDate = DateTime.Now.AddDays(22),
                    UserId = users[2].UserId,
                    Latitude = -8.3405,
                    Longitude = 115.0920
                }
            };

            context.Trips.AddRange(trips);
            await context.SaveChangesAsync();

            // Seed Itinerary Items
            var itineraryItems = new List<ItineraryItem>
            {
                new ItineraryItem
                {
                    TripId = trips[0].TripId,
                    Name = "Senso-ji Temple Visit",
                    Type = ItineraryItemType.Activity,
                    StartTime = trips[0].StartDate.AddHours(10),
                    EndTime = trips[0].StartDate.AddHours(12),
                    Address = "2 Chome-3-1 Asakusa, Taito City, Tokyo 111-0032, Japan",
                    Latitude = 35.7148,
                    Longitude = 139.7967
                },
                new ItineraryItem
                {
                    TripId = trips[0].TripId,
                    Name = "Hotel Booking",
                    Type = ItineraryItemType.Hotel,
                    StartTime = trips[0].StartDate,
                    EndTime = trips[0].EndDate,
                    Address = "Shibuya, Tokyo, Japan",
                    Latitude = 35.6598,
                    Longitude = 139.7006
                }
            };

            context.ItineraryItems.AddRange(itineraryItems);
            await context.SaveChangesAsync();

            // Seed Follow relationships
            var follows = new List<Follow>
            {
                new Follow
                {
                    FollowerId = users[0].UserId,
                    FollowingId = users[1].UserId
                },
                new Follow
                {
                    FollowerId = users[1].UserId,
                    FollowingId = users[2].UserId
                }
            };

            context.Follows.AddRange(follows);
            await context.SaveChangesAsync();
        }
    }
}
