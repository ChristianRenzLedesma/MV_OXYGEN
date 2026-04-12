# MV Oxygen Trading - Dashboard Starter Kit

## Overview
A complete user dashboard starter kit built with Laravel, React/TypeScript, and Inertia.js. Features a modern sidebar navigation, stats cards, and rental management functionality.

## Dashboard Features

### Sidebar Navigation
- **Dashboard** - Main overview page
- **New Request** - Create rental requests
- **My Rentals** - View all rentals
- **History** - Rental history (Coming Soon)
- **Settings** - User settings (Coming Soon)

### Main Dashboard Components

#### 1. Stats Cards
- **Pending Requests** - Shows count of pending rental requests
- **Active Rentals** - Currently active rentals
- **Approved Requests** - Approved rental requests  
- **Completed** - Completed rentals

#### 2. Quick Actions
- **New Rental Request** - Button to create new requests
- **View All Rentals** - Navigate to rentals list

#### 3. Recent Rental Requests
- Shows latest 5 rental requests
- Displays status, dates, quantity, and purpose
- "View All" link for complete list

## File Structure

### Pages
```
resources/js/pages/user/
- dashboard.tsx              # Main dashboard page
- dashboard-test.tsx         # Simple test page
- rentals/
  - index.tsx               # Rentals list page
  - create.tsx              # Create rental request
```

### Components
```
resources/js/components/
- user-sidebar.tsx           # User navigation sidebar
- breadcrumbs.tsx           # Breadcrumb navigation
- nav-main.tsx              # Main navigation items
- nav-user.tsx              # User menu component
- user-info.tsx             # User profile display
```

### Layouts
```
resources/js/layouts/
- user-layout.tsx            # User dashboard layout
```

### Controllers
```
app/Http/Controllers/
- UserDashboardController.php    # Dashboard data and logic
- UserRentalController.php       # Rental management
```

## Key Features

### Authentication
- User login with email/password
- OTP verification system
- Protected routes with middleware

### Data Display
- Real-time stats from database
- Responsive design for mobile/desktop
- Interactive sidebar with collapse/expand

### Database Integration
- Rental requests tracking
- Customer data management
- Status updates (pending/approved/rejected/completed)

## Getting Started

### 1. Install Dependencies
```bash
npm install
composer install
```

### 2. Environment Setup
```bash
cp .env.example .env
php artisan key:generate
```

### 3. Database Setup
```bash
php artisan migrate
php artisan db:seed --class=TestUserSeeder
```

### 4. Start Development Server
```bash
npm run dev
php artisan serve
```

### 5. Login Credentials
- **Email:** test@example.com
- **Password:** password

## Customization Guide

### Colors & Theme
- Primary color: `#1E88E5` (Blue)
- Sidebar: Dark blue background
- Cards: White with colored borders

### Adding New Stats Cards
In `dashboard.tsx`, add to the stats grid:
```tsx
<div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[color]">
    <div className="flex items-center justify-between">
        <div>
            <p className="text-gray-500 text-sm">Stat Name</p>
            <p className="text-2xl font-bold text-gray-800">{statValue}</p>
        </div>
        <div className="w-12 h-12 bg-[color]-100 rounded-full flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-[color]-600" />
        </div>
    </div>
</div>
```

### Adding New Sidebar Items
In `user-sidebar.tsx`, add to `mainNavItems`:
```tsx
{
    title: 'New Page',
    url: '/user/new-page',
    icon: NewIcon,
    disabled: false
}
```

### Creating New Pages
1. Create page in `resources/js/pages/user/`
2. Add controller method in `UserDashboardController.php`
3. Add route in `routes/web.php`
4. Include auth data in controller response

## Technologies Used

### Frontend
- **React 18** with TypeScript
- **Inertia.js** for SPA-like navigation
- **TailwindCSS** for styling
- **Lucide React** for icons
- **Radix UI** for components

### Backend
- **Laravel 12** PHP framework
- **MySQL** database
- **Eloquent ORM** for data modeling
- **Blade** templating (minimal)

### Authentication
- **Laravel Sanctum** for API auth
- **OTP verification** system
- **Session-based** authentication

## Database Schema

### Users Table
- id, name, email, password, phone, email_verified_at

### Rental Requests Table  
- id, customer_id, tank_type, quantity, start_date, end_date, purpose, status

### Rentals Table
- id, customer_id, tank_id, start_date, end_date, status, pickup_date

## Deployment Notes

### Environment Variables
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mv_oxygen
DB_USERNAME=root
DB_PASSWORD=

APP_URL=http://localhost:8000
VITE_APP_NAME="MV Oxygen Trading"
```

### Production Build
```bash
npm run build
php artisan optimize
php artisan config:cache
```

## Support & Extensions

This starter kit provides a solid foundation for:
- Rental management systems
- Service booking platforms  
- Inventory management dashboards
- Customer portals

The modular structure allows easy extension and customization based on specific business needs.
