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
                    Email = "user1@nzmsa.co.nz",
                    Password = "AQAAAAIAAYagAAAAEC8BZRKdv4E6uhvTT6u9utZ2A/TPn2iA7LRBAaS4KX5og7V+v60dMy3jyuFt5RZgQg==", // password123
                    Description = "Adventure seeker and travel enthusiast"
                },
                new User
                {
                    FirstName = "Jane",
                    LastName = "Smith",
                    Email = "user2@nzmsa.co.nz",
                    Password = "AQAAAAIAAYagAAAAEC8BZRKdv4E6uhvTT6u9utZ2A/TPn2iA7LRBAaS4KX5og7V+v60dMy3jyuFt5RZgQg==",
                    Description = "Love exploring new cultures and cuisines"
                },
                new User
                {
                    FirstName = "Mike",
                    LastName = "Johnson",
                    Email = "user3@nzmsa.co.nz",
                    Password = "AQAAAAIAAYagAAAAEC8BZRKdv4E6uhvTT6u9utZ2A/TPn2iA7LRBAaS4KX5og7V+v60dMy3jyuFt5RZgQg==",
                    Description = "Digital nomad and photographer"
                },
                new User
                {
                    FirstName = "Alice",
                    LastName = "Brown",
                    Email = "user4@nzmsa.co.nz",
                    Password = "AQAAAAIAAYagAAAAEC8BZRKdv4E6uhvTT6u9utZ2A/TPn2iA7LRBAaS4KX5og7V+v60dMy3jyuFt5RZgQg==",
                    Description = "Hiker and outdoor lover"
                },
                new User
                {
                    FirstName = "Bob",
                    LastName = "Williams",
                    Email = "user5@nzmsa.co.nz",
                    Password = "AQAAAAIAAYagAAAAEC8BZRKdv4E6uhvTT6u9utZ2A/TPn2iA7LRBAaS4KX5og7V+v60dMy3jyuFt5RZgQg==",
                    Description = "History buff and foodie"
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
                },
                new Trip
                {
                    Name = "New York City Break",
                    Destination = "New York, USA",
                    StartDate = DateTime.Now.AddDays(10),
                    EndDate = DateTime.Now.AddDays(15),
                    UserId = users[3].UserId,
                    Latitude = 40.7128,
                    Longitude = -74.0060
                },
                new Trip
                {
                    Name = "Sydney Getaway",
                    Destination = "Sydney, Australia",
                    StartDate = DateTime.Now.AddDays(45),
                    EndDate = DateTime.Now.AddDays(52),
                    UserId = users[4].UserId,
                    Latitude = -33.8688,
                    Longitude = 151.2093
                }
            };

            context.Trips.AddRange(trips);
            await context.SaveChangesAsync();

            // Seed Itinerary Items
            var itineraryItems = new List<ItineraryItem>
            {
                // Tokyo Adventure
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
                },
                new ItineraryItem
                {
                    TripId = trips[0].TripId,
                    Name = "Tsukiji Fish Market Tour",
                    Type = ItineraryItemType.Activity,
                    StartTime = trips[0].StartDate.AddHours(7),
                    EndTime = trips[0].StartDate.AddHours(10),
                    Address = "4 Chome-13 Tsukiji, Chuo City, Tokyo 104-0045, Japan",
                    Latitude = 35.6652,
                    Longitude = 139.7708
                },
                new ItineraryItem
                {
                    TripId = trips[0].TripId,
                    Name = "Tokyo Skytree Visit",
                    Type = ItineraryItemType.Activity,
                    StartTime = trips[0].StartDate.AddHours(15),
                    EndTime = trips[0].StartDate.AddHours(17),
                    Address = "1 Chome-1-2 Oshiage, Sumida City, Tokyo 131-0045, Japan",
                    Latitude = 35.7100,
                    Longitude = 139.8107
                },
                new ItineraryItem
                {
                    TripId = trips[0].TripId,
                    Name = "Shibuya Crossing Photo",
                    Type = ItineraryItemType.Activity,
                    StartTime = trips[0].StartDate.AddHours(20),
                    EndTime = trips[0].StartDate.AddHours(21),
                    Address = "Shibuya City, Tokyo, Japan",
                    Latitude = 35.6595,
                    Longitude = 139.7005
                },

                // European Tour
                new ItineraryItem
                {
                    TripId = trips[1].TripId,
                    Name = "Eiffel Tower Tour",
                    Type = ItineraryItemType.Activity,
                    StartTime = trips[1].StartDate.AddHours(9),
                    EndTime = trips[1].StartDate.AddHours(11),
                    Address = "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France",
                    Latitude = 48.8584,
                    Longitude = 2.2945
                },
                new ItineraryItem
                {
                    TripId = trips[1].TripId,
                    Name = "Louvre Museum Visit",
                    Type = ItineraryItemType.Activity,
                    StartTime = trips[1].StartDate.AddHours(12),
                    EndTime = trips[1].StartDate.AddHours(15),
                    Address = "Rue de Rivoli, 75001 Paris, France",
                    Latitude = 48.8606,
                    Longitude = 2.3376
                },
                new ItineraryItem
                {
                    TripId = trips[1].TripId,
                    Name = "Hotel Check-in",
                    Type = ItineraryItemType.Hotel,
                    StartTime = trips[1].StartDate,
                    EndTime = trips[1].EndDate,
                    Address = "8th arrondissement, Paris, France",
                    Latitude = 48.8708,
                    Longitude = 2.3090
                },
                new ItineraryItem
                {
                    TripId = trips[1].TripId,
                    Name = "Seine River Cruise",
                    Type = ItineraryItemType.Activity,
                    StartTime = trips[1].StartDate.AddHours(18),
                    EndTime = trips[1].StartDate.AddHours(20),
                    Address = "Port de la Bourdonnais, 75007 Paris, France",
                    Latitude = 48.8583,
                    Longitude = 2.2945
                },
                new ItineraryItem
                {
                    TripId = trips[1].TripId,
                    Name = "Montmartre Walk",
                    Type = ItineraryItemType.Activity,
                    StartTime = trips[1].StartDate.AddHours(21),
                    EndTime = trips[1].StartDate.AddHours(23),
                    Address = "Montmartre, 75018 Paris, France",
                    Latitude = 48.8867,
                    Longitude = 2.3431
                },

                // Bali Retreat
                new ItineraryItem
                {
                    TripId = trips[2].TripId,
                    Name = "Beach Resort Stay",
                    Type = ItineraryItemType.Hotel,
                    StartTime = trips[2].StartDate,
                    EndTime = trips[2].EndDate,
                    Address = "Kuta, Bali, Indonesia",
                    Latitude = -8.7174,
                    Longitude = 115.1682
                },
                new ItineraryItem
                {
                    TripId = trips[2].TripId,
                    Name = "Ubud Monkey Forest",
                    Type = ItineraryItemType.Activity,
                    StartTime = trips[2].StartDate.AddHours(9),
                    EndTime = trips[2].StartDate.AddHours(12),
                    Address = "Jl. Monkey Forest, Ubud, Gianyar, Bali, Indonesia",
                    Latitude = -8.5190,
                    Longitude = 115.2584
                },
                new ItineraryItem
                {
                    TripId = trips[2].TripId,
                    Name = "Tegalalang Rice Terrace Tour",
                    Type = ItineraryItemType.Activity,
                    StartTime = trips[2].StartDate.AddHours(13),
                    EndTime = trips[2].StartDate.AddHours(15),
                    Address = "Tegalalang, Gianyar, Bali, Indonesia",
                    Latitude = -8.4359,
                    Longitude = 115.2798
                },
                new ItineraryItem
                {
                    TripId = trips[2].TripId,
                    Name = "Uluwatu Temple Sunset",
                    Type = ItineraryItemType.Activity,
                    StartTime = trips[2].StartDate.AddHours(16),
                    EndTime = trips[2].StartDate.AddHours(19),
                    Address = "Uluwatu, Bali, Indonesia",
                    Latitude = -8.8170,
                    Longitude = 115.0856
                },
                new ItineraryItem
                {
                    TripId = trips[2].TripId,
                    Name = "Balinese Cooking Class",
                    Type = ItineraryItemType.Activity,
                    StartTime = trips[2].StartDate.AddHours(20),
                    EndTime = trips[2].StartDate.AddHours(23),
                    Address = "Ubud, Bali, Indonesia",
                    Latitude = -8.5069,
                    Longitude = 115.2650
                },

                // New York City Break
                new ItineraryItem
                {
                    TripId = trips[3].TripId,
                    Name = "Central Park Walk",
                    Type = ItineraryItemType.Activity,
                    StartTime = trips[3].StartDate.AddHours(9),
                    EndTime = trips[3].StartDate.AddHours(11),
                    Address = "Central Park, New York, NY, USA",
                    Latitude = 40.7851,
                    Longitude = -73.9683
                },
                new ItineraryItem
                {
                    TripId = trips[3].TripId,
                    Name = "Times Square Visit",
                    Type = ItineraryItemType.Activity,
                    StartTime = trips[3].StartDate.AddHours(12),
                    EndTime = trips[3].StartDate.AddHours(14),
                    Address = "Times Square, New York, NY, USA",
                    Latitude = 40.7580,
                    Longitude = -73.9855
                },
                new ItineraryItem
                {
                    TripId = trips[3].TripId,
                    Name = "Metropolitan Museum of Art",
                    Type = ItineraryItemType.Activity,
                    StartTime = trips[3].StartDate.AddHours(15),
                    EndTime = trips[3].StartDate.AddHours(18),
                    Address = "1000 5th Ave, New York, NY 10028, USA",
                    Latitude = 40.7794,
                    Longitude = -73.9632
                },
                new ItineraryItem
                {
                    TripId = trips[3].TripId,
                    Name = "Broadway Show",
                    Type = ItineraryItemType.Activity,
                    StartTime = trips[3].StartDate.AddHours(19),
                    EndTime = trips[3].StartDate.AddHours(22),
                    Address = "Broadway, New York, NY, USA",
                    Latitude = 40.7590,
                    Longitude = -73.9845
                },
                new ItineraryItem
                {
                    TripId = trips[3].TripId,
                    Name = "Hotel Check-in",
                    Type = ItineraryItemType.Hotel,
                    StartTime = trips[3].StartDate,
                    EndTime = trips[3].EndDate,
                    Address = "Manhattan, New York, NY, USA",
                    Latitude = 40.7580,
                    Longitude = -73.9855
                },

                // Sydney Getaway
                new ItineraryItem
                {
                    TripId = trips[4].TripId,
                    Name = "Sydney Opera House Tour",
                    Type = ItineraryItemType.Activity,
                    StartTime = trips[4].StartDate.AddHours(14),
                    EndTime = trips[4].StartDate.AddHours(16),
                    Address = "Bennelong Point, Sydney NSW 2000, Australia",
                    Latitude = -33.8568,
                    Longitude = 151.2153
                },
                new ItineraryItem
                {
                    TripId = trips[4].TripId,
                    Name = "Bondi Beach Day",
                    Type = ItineraryItemType.Activity,
                    StartTime = trips[4].StartDate.AddHours(10),
                    EndTime = trips[4].StartDate.AddHours(13),
                    Address = "Bondi Beach, NSW, Australia",
                    Latitude = -33.8908,
                    Longitude = 151.2743
                },
                new ItineraryItem
                {
                    TripId = trips[4].TripId,
                    Name = "Harbour Bridge Climb",
                    Type = ItineraryItemType.Activity,
                    StartTime = trips[4].StartDate.AddHours(17),
                    EndTime = trips[4].StartDate.AddHours(19),
                    Address = "3 Cumberland St, Sydney NSW 2000, Australia",
                    Latitude = -33.8523,
                    Longitude = 151.2108
                },
                new ItineraryItem
                {
                    TripId = trips[4].TripId,
                    Name = "Taronga Zoo Visit",
                    Type = ItineraryItemType.Activity,
                    StartTime = trips[4].StartDate.AddHours(9),
                    EndTime = trips[4].StartDate.AddHours(12),
                    Address = "Bradleys Head Rd, Mosman NSW 2088, Australia",
                    Latitude = -33.8430,
                    Longitude = 151.2413
                },
                new ItineraryItem
                {
                    TripId = trips[4].TripId,
                    Name = "Hotel Check-in",
                    Type = ItineraryItemType.Hotel,
                    StartTime = trips[4].StartDate,
                    EndTime = trips[4].EndDate,
                    Address = "Sydney CBD, NSW, Australia",
                    Latitude = -33.8688,
                    Longitude = 151.2093
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
                },
                new Follow
                {
                    FollowerId = users[2].UserId,
                    FollowingId = users[3].UserId
                },
                new Follow
                {
                    FollowerId = users[3].UserId,
                    FollowingId = users[4].UserId
                }
            };

            context.Follows.AddRange(follows);
            await context.SaveChangesAsync();
        }
    }
}
