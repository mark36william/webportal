using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using AutoMapper;
using Microsoft.OpenApi.Models;
using System.Text;
using WebPortal.API.Data;
using WebPortal.API.DTOs;
using WebPortal.API.Models;
using WebPortal.API.Repositories;
using WebPortal.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://127.0.0.1:5173") // Update this with your client URL
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();  
    });
});

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Configure DbContext and Identity
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// Configure Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

// Register repositories with proper generic type parameters
builder.Services.AddScoped(typeof(IRepository<,>), typeof(Repository<,>));
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IPropertyRepository, PropertyRepository>();

// Register services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IRecentlyViewedService, RecentlyViewedService>();

// Add AutoMapper with profiles
builder.Services.AddAutoMapper(typeof(Program).Assembly);

// Add controllers
builder.Services.AddControllers();

// Configure Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "WebPortal API", 
        Version = "v1",
        Description = "WebPortal API Documentation",
        Contact = new OpenApiContact
        {
            Name = "WebPortal Support",
            Email = "support@webportal.com"
        }
    });
    
    // Add JWT Authentication to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = @"JWT Authorization header using the Bearer scheme. 
                      Enter 'Bearer' [space] and then your token in the text input below.
                      Example: 'Bearer 12345abcdef'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header,
            },
            new List<string>()
        }
    });
    
    // Enable XML comments for better documentation
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseSwagger(c =>
{
    c.SerializeAsV2 = true;
});

app.UseSwaggerUI(c =>
{
    // Use relative path for Swagger JSON
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebPortal API V1");
    
    // Serve the Swagger UI at the /swagger path to match launch settings
    c.RoutePrefix = "swagger";
    
    // UI configuration
    c.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.None);
    c.EnableFilter();
    c.DefaultModelsExpandDepth(-1); // Hide schemas by default
    
    // Enable deep linking for direct navigation to operations
    c.EnableDeepLinking();
    
    // Display operation ID in the UI
    c.DisplayOperationId();
});

app.UseHttpsRedirection();

// Use CORS before authentication and authorization
app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Apply migrations and create database if it doesn't exist
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    try
    {
        logger.LogInformation("Starting database migration...");
        var context = services.GetRequiredService<ApplicationDbContext>();
        
        // Ensure database is created and apply migrations
        logger.LogInformation("Ensuring database is created...");
        await context.Database.EnsureCreatedAsync();
        logger.LogInformation("Applying migrations...");
        await context.Database.MigrateAsync();
        
        // Seed property data only
        logger.LogInformation("Seeding property data...");
        await PropertySeedData.SeedAsync(context);
        
        // Verify data was added
        var propertyCount = await context.Properties.CountAsync();
        logger.LogInformation($"Successfully seeded {propertyCount} properties.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred during database initialization");
        throw; // Re-throw to see the full error in the console
    }
}

app.Run();
