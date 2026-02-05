# Radio Agakiza Admin Panel

## Quick Setup

1. **Setup Admin User**
   ```bash
   npm run admin:setup
   ```
   This creates an admin user with:
   - Email: `admin@radioagakiza.com`
   - Password: `admin123`

2. **Add Sample Data** (optional)
   ```bash
   npm run admin:sample
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access Admin Panel**
   - URL: http://localhost:3000/admin/login
   - Login with the credentials above

## Features

### ✅ Authentication
- JWT-based login/logout
- Protected routes
- Session management

### ✅ CRUD Management
- **Programs**: Create, edit, delete radio programs with hosts and schedules
- **News**: Manage articles with draft/published status
- **Podcasts**: Upload and manage podcast episodes
- **Testimonials**: Manage listener testimonials with publish control
- **Streaming**: Update live stream URL without server restart

### ✅ Admin Interface
- Clean, table-based UI
- Mobile-friendly responsive design
- Form validation
- Loading states and error handling
- Confirmation dialogs for deletions

## API Endpoints

All admin endpoints require `Authorization: Bearer <token>` header:

```
POST /api/v1/admin/login          # Login
GET  /api/v1/admin/verify         # Verify token

GET    /api/v1/admin/programs     # List programs
POST   /api/v1/admin/programs     # Create program
PUT    /api/v1/admin/programs/:id # Update program
DELETE /api/v1/admin/programs/:id # Delete program

GET    /api/v1/admin/news         # List articles
POST   /api/v1/admin/news         # Create article
PUT    /api/v1/admin/news/:id     # Update article
DELETE /api/v1/admin/news/:id     # Delete article

GET    /api/v1/admin/podcasts     # List episodes
POST   /api/v1/admin/podcasts     # Create episode
PUT    /api/v1/admin/podcasts/:id # Update episode
DELETE /api/v1/admin/podcasts/:id # Delete episode

GET    /api/v1/admin/testimonials     # List testimonials
POST   /api/v1/admin/testimonials     # Create testimonial
PUT    /api/v1/admin/testimonials/:id # Update testimonial
DELETE /api/v1/admin/testimonials/:id # Delete testimonial

GET /api/v1/admin/settings/stream     # Get stream URL
PUT /api/v1/admin/settings/stream     # Update stream URL
```

## How Authentication Works

1. **Login**: User submits email/password → Server validates → Returns JWT token
2. **Protected Routes**: Client sends token in Authorization header → Server validates → Allows access
3. **Frontend**: Token stored in localStorage, automatically included in API calls
4. **Logout**: Token removed from localStorage

## How to Extend CRUD

To add a new content type (e.g., "Events"):

1. **Database**: Add table to schema
2. **API Controller**: Add CRUD methods to `api/controllers/adminController.js`
3. **API Routes**: Add routes to `api/routes/admin.js`
4. **Frontend Page**: Create `app/admin/events/page.tsx` following existing patterns
5. **Navigation**: Add link to `app/admin/layout.tsx` sidebar

## Security Notes

- Admin role required for all operations
- JWT tokens expire in 1 hour
- Passwords hashed with bcrypt
- SQL injection protection via parameterized queries
- CORS and input validation implemented

## Production Checklist

- [ ] Change default admin password
- [ ] Set strong JWT secret in environment
- [ ] Enable HTTPS
- [ ] Set up proper database backups
- [ ] Configure rate limiting
- [ ] Add audit logging
