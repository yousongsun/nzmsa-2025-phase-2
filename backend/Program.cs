using backend.Context;
using backend.Repositories.Abstract;
using backend.Repositories.Concrete;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using backend.Services;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Declare flag here so it's visible both when registering and initializing
var useSqlServer = false;

// Configure DbContext Entity Framework Core
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseInMemoryDatabase("AppDbContext"));
}
else
{
    var sqlConnectionString = builder.Configuration.GetConnectionString("AppDbContext");

    if (!string.IsNullOrEmpty(sqlConnectionString))
    {
        try
        {
            using var connection = new SqlConnection(sqlConnectionString);
            connection.Open();
            useSqlServer = true;
        }
        catch (SqlException)
        {
            // If connection fails, fallback to SQLite
            useSqlServer = false;
            Console.WriteLine("SQL Server connection failed, using SQLite instead.");
        }
    }

    builder.Services.AddDbContext<AppDbContext>(options =>
    {
        if (useSqlServer)
            options.UseSqlServer(sqlConnectionString!);
        else
            options.UseSqlite("Data Source=AppDbContext.db");
    });
}

// Register the repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITripRepository, TripRepository>();
builder.Services.AddScoped<IItineraryItemRepository, ItineraryItemRepository>();
builder.Services.AddScoped<ISharedTripRepository, SharedTripRepository>();
builder.Services.AddScoped<IFollowRepository, FollowRepository>();
builder.Services.AddScoped<ITripInviteRepository, TripInviteRepository>();
builder.Services.AddScoped<IPostRepository, PostRepository>();
builder.Services.AddScoped<TokenService>();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
                  .AllowAnyHeader()
                .AllowAnyMethod()
                .SetIsOriginAllowed(origin => true)
                .AllowCredentials();
        });
});

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        // Configure JSON serializer to handle reference loops
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrEmpty(jwtKey))
{
    throw new InvalidOperationException("JWT Key is not configured in appsettings.json.");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

var app = builder.Build();

// Ensure uploads and uploads/posts directories exist
var uploadsPath = Path.Combine(app.Environment.ContentRootPath, "uploads");
var postsPath = Path.Combine(uploadsPath, "posts");
if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
}
if (!Directory.Exists(postsPath))
{
    Directory.CreateDirectory(postsPath);
}

// Initialize Database
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    if (useSqlServer)
    {
        // apply pending migrations on SQL Server
        dbContext.Database.Migrate();
    }
    else
    {
        // create SQLite or in-memory schema
        dbContext.Database.EnsureCreated();
    }

    // Seed the database with initial data (only in development)
    if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
    {
        await DbSeeder.SeedDataAsync(dbContext);
    }
}

// Configure Middleware

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable CORS
app.UseCors("AllowReactApp");

// Configure static file serving for uploads
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(app.Environment.ContentRootPath, "uploads")),
    RequestPath = "/uploads"
});

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
