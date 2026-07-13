# VaiRadiology Frontend

A modern, responsive React/Next.js web application for task management and image annotation. This frontend provides an intuitive interface for managing daily tasks using a Kanban board and annotating medical images with polygon drawings.

## 🎯 Features

### Task Management (`/tasks`)
- **Kanban Board**: Organize tasks across "To Do", "In Progress", and "Done" columns
- **Date-based Organization**: View and manage tasks for specific dates with an interactive date selector
- **Drag & Drop**: Seamlessly move tasks between columns
- **Task Details**: Title, description, priority (Low/Medium/High/Urgent), due date, and tags
- **CRUD Operations**: Create, read, update, and delete tasks
- **Real-time Sync**: All changes persist to the backend database

### Image Annotation (`/annotate`)
- **Image Upload**: Drag-and-drop or click to upload images
- **Polygon Drawing**: Draw custom polygons on images to annotate regions of interest
- **Multi-image Support**: Slide through multiple images with thumbnail carousel
- **Annotation Labeling**: Label each annotation with custom text
- **Persistence**: Save all annotations to the database
- **Annotation Management**: View, select, and delete annotations

### Authentication
- **Sign Up**: Create new user accounts with email and password
- **Login**: Secure login with token-based authentication
- **Session Management**: Automatic logout on token expiration
- **Protected Routes**: All routes require authentication

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **UI Components**: React Beautiful DND (drag-drop), React Hot Toast (notifications)
- **Date Handling**: date-fns
- **Icons**: Heroicons React

## 📋 Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Backend**: Django API deployed on `https://vai-rad-backend.onrender.com/api`

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd vairadiology_frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=https://vai-rad-backend.onrender.com/api
```

### 4. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 5. Build for Production
```bash
npm run build
npm start
```

## 📁 Project Structure

```
vairadiology_frontend/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── login/
│   │   └── page.tsx       # Login page
│   ├── signup/
│   │   └── page.tsx       # Signup page
│   ├── dashboard/
│   │   └── page.tsx       # Dashboard overview
│   ├── tasks/
│   │   └── page.tsx       # Task management (Kanban board)
│   ├── annotate/
│   │   └── page.tsx       # Image annotation page
│   ├── calendar/
│   │   └── page.tsx       # Calendar view
│   ├── reports/
│   │   └── page.tsx       # Analytics & reports
│   ├── settings/
│   │   └── page.tsx       # Account settings
│   └── help/
│       └── page.tsx       # FAQ & help
├── components/             # Reusable React components
│   ├── Sidebar.tsx        # App sidebar navigation
│   ├── TopNavbar.tsx      # Top navigation bar
│   ├── Navigation.tsx     # Legacy navigation (unused)
│   ├── DateSelector.tsx   # Date picker for tasks
│   ├── Board.tsx          # Kanban board container
│   ├── Column.tsx         # Task column component
│   ├── TaskCard.tsx       # Individual task card
│   ├── TaskModal.tsx      # Modal for creating/editing tasks
│   ├── TaskDetailsModal.tsx # Modal for viewing task details
│   ├── AnnotationCanvas.tsx # Canvas for drawing annotations
│   ├── ImageCarousel.tsx  # Image slider component
│   ├── ImageUploader.tsx  # File upload component
│   ├── AnnotationPanel.tsx # Annotation list sidebar
│   └── SaveAnnotationModal.tsx # Modal for saving annotations
├── services/              # API services
│   └── apiService.ts      # Axios instance and API methods
├── store/                 # Zustand state management
│   ├── authStore.ts       # Authentication state
│   ├── taskStore.ts       # Task state
│   └── annotationStore.ts # Image annotation state
├── types/                 # TypeScript type definitions
│   └── index.ts          # All types
├── utils/                 # Helper functions
│   └── helpers.ts        # Utility functions
├── public/               # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## 🔑 Key Components

### Authentication Flow
1. User navigates to `/login` or `/signup`
2. Credentials are sent to the backend
3. On success, token is stored in localStorage
4. Token is automatically included in all subsequent API requests
5. Logout clears token and redirects to login

### Task Management Flow
1. User selects a date using the DateSelector
2. Tasks for that date are fetched and displayed in a Kanban board
3. User can create new tasks (assigned to selected date automatically)
4. Tasks can be dragged between columns to change status
5. All changes sync to the backend in real-time

### Image Annotation Flow
1. User uploads image(s) via drag-drop or file picker
2. Image is displayed on canvas with annotation tools
3. User draws polygons by clicking points on the canvas
4. User clicks "Finish & Save" to open save modal
5. Annotation is labeled and saved to database
6. User can view all annotations in the sidebar panel
7. Images can be navigated with thumbnail carousel

## 🎨 Styling

The application uses **Tailwind CSS** with custom configurations:
- Custom color palette with primary blue and purple accents
- Responsive design (mobile-first approach)
- Smooth transitions and hover effects
- Custom CSS components (`.btn`, `.card`, `.input`, `.modal-overlay`)

## 🔒 Security Features

- Token-based authentication (stored in localStorage)
- Authorization headers included in all API requests
- Automatic logout on 401 responses
- Protected routes require authentication

## 📡 API Integration

All API calls are handled through the `apiService` in `/services/apiService.ts`:
- Automatic token inclusion in headers
- Centralized error handling
- Timeout management
- Response/request interceptors

### API Endpoints Used
```
POST   /api/auth/signup/          # Register new user
POST   /api/auth/login/           # Login, get token
POST   /api/auth/logout/          # Delete token
GET    /api/auth/user/            # Get current user

GET    /api/tasks/                # List tasks (paginated, filterable)
POST   /api/tasks/                # Create task
GET    /api/tasks/{id}/           # Get task
PATCH  /api/tasks/{id}/           # Update task
DELETE /api/tasks/{id}/           # Delete task

GET    /api/annotation-images/    # List images (paginated)
POST   /api/annotation-images/    # Upload image (multipart)
GET    /api/annotation-images/{id}/ # Get image
DELETE /api/annotation-images/{id}/ # Delete image + file

GET    /api/polygon-annotations/     # List polygons (paginated)
POST   /api/polygon-annotations/     # Create polygon
GET    /api/polygon-annotations/{id}/ # Get polygon
PATCH  /api/polygon-annotations/{id}/ # Update polygon
DELETE /api/polygon-annotations/{id}/ # Delete polygon
```

## 🐛 Troubleshooting

### Common Issues

**Issue**: API calls fail with "Network Error"
- **Solution**: Ensure backend is reachable at `https://vai-rad-backend.onrender.com`
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify CORS is configured on the backend for your frontend domain

**Issue**: Automatic logout happening frequently
- **Solution**: Check backend token expiration settings
- Ensure token is valid and not corrupted in localStorage

**Issue**: Images not displaying
- **Solution**: Verify backend is serving images correctly
- Check CORS configuration on backend

**Issue**: Drag-drop not working
- **Solution**: Ensure `react-beautiful-dnd` is properly installed
- Clear browser cache and restart dev server

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://vai-rad-backend.onrender.com/api
   ```
4. Deploy with `npm run build`

### Deploy to Netlify

1. Configure build command: `npm run build`
2. Set publish directory: `.next`
3. Add environment variables
4. Deploy

### Deploy Manually

```bash
npm run build
npm start
```

## 📝 Challenges & Solutions

### Challenge 1: State Management Across Components
**Problem**: Task date filtering needed to be synchronized across multiple components
**Solution**: Used Zustand for global state management with derived getters (`getTasksByDate`, `getTasksByStatus`)

### Challenge 2: Canvas Drawing Precision
**Problem**: Canvas coordinates didn't match visual display due to browser scaling
**Solution**: Implemented `calculateCanvasPoint` helper that accounts for DPI scaling and container sizing

### Challenge 3: Drag-Drop with API Sync
**Problem**: Drag-drop conflicts with server state updates
**Solution**: Optimistic updates with fallback to server state on error, debounced API calls

### Challenge 4: Image Upload Size Validation
**Problem**: Large files consuming too much bandwidth
**Solution**: File size validation on frontend, with backend enforcing max 10MB limit

### Challenge 5: Token Persistence Across Navigation
**Problem**: Token lost after page refresh
**Solution**: Stored token in localStorage with automatic restoration in root layout useEffect

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Beautiful DND Documentation](https://beautiful-dnd.netlify.app/)

## 👨‍💻 Development Tips

1. **Add a new page**: Create folder in `/app` with `page.tsx`
2. **Add a new component**: Create component in `/components` folder
3. **Add API endpoint**: Update `/services/apiService.ts`
4. **Add state**: Create store in `/store` folder using Zustand
5. **Style components**: Use Tailwind classes and custom CSS in `globals.css`

## 🔄 Workflow

```bash
# Start development
npm run dev

# Format code
npm run format

# Run linter
npm run lint

# Build production
npm run build

# Start production server
npm start
```

## 📄 License

This project is proprietary and confidential.

## 👥 Support

For issues or questions, please contact the development team or create an issue in the repository.

---

**Happy Coding!** 🚀✨
"# vairad_frontend" 
