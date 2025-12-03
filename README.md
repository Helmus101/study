# Proactive AI Study Workspace

A modern React application demonstrating an intelligent study platform with AI-powered insights, task management, and a full-featured study canvas.

## Features

### 1. Proactive AI Dashboard
- **Smart Feed**: AI-curated updates from Pronote, Google Docs, and AI sources
- **Daily Plan Cards**: Organized by morning, afternoon, and evening timeframes with AI-generated focus blocks
- **Analytics**: Placeholder metrics for focus score, energy levels, and synchronization status

### 2. Task Manager
- Tasks grouped by urgency: **Today**, **This Week**, **Upcoming**, **Overdue**
- Pronote badges indicating school-synced tasks
- AI-generated subtasks with confidence scores
- Real-time status updates via optimistic UI patterns

### 3. Study Session Canvas
- **Full-screen layout** with integrated components:
  - **Main Editor**: Google Doc mirror with live sync (mocked)
  - **Left Sidebar**: AI Assistant providing contextual suggestions
  - **Right Panel**: Mini-calendar and task checklist
  - **Bottom Controls**: Environment settings (music, Pomodoro timer, scene)
  - **File Viewer**: Attached references and documents
  - **Flashcards & Quiz**: AI-generated study aids (placeholders)

## Technology Stack

- **React 19** with TypeScript
- **Vite** for fast development and build
- **React Router** for navigation
- **TanStack Query** (React Query) for server state management
- **Zustand** for client-side state
- **Socket.io Client** for WebSocket mock integration
- **date-fns** for date handling
- **Lucide React** for icons

## Architecture

### State Management
- **React Query**: Handles all server state with automatic caching, refetching, and optimistic updates
- **Zustand**: Manages local UI state (layout mode toggles)
- **WebSocket Mock**: Simulates real-time updates from Pronote, Google Docs, and AI services

### Mock API
All backend interactions use mock endpoints (`src/api/mockApi.ts`) that simulate:
- Dashboard data fetching
- Task CRUD operations
- Study session management
- Real-time synchronization

### Layout Modes
Two layout modes demonstrate different UX approaches:
1. **Fixed Layout** (default): Locked sections optimized for focus
2. **Customizable Layout** (beta): Documented as future drag-and-resize capability

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── api/
│   ├── mockApi.ts          # Mock backend endpoints
│   ├── mockSocket.ts       # WebSocket simulation
│   └── queryKeys.ts        # React Query key definitions
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── dashboard/          # Dashboard-specific components
│   │   ├── Analytics.tsx
│   │   ├── DailyPlan.tsx
│   │   └── SmartFeed.tsx
│   ├── tasks/              # Task Manager components
│   │   ├── TaskCard.tsx
│   │   └── TaskGroup.tsx
│   ├── canvas/             # Study Canvas components
│   │   ├── AIAssistant.tsx
│   │   ├── DocEditor.tsx
│   │   ├── EnvironmentControls.tsx
│   │   ├── FileViewer.tsx
│   │   ├── Flashcards.tsx
│   │   ├── QuizPlaceholder.tsx
│   │   └── RightPanel.tsx
│   ├── LayoutToggle.tsx
│   └── Navigation.tsx
├── hooks/
│   └── useRealtimeSync.ts  # WebSocket integration hook
├── pages/
│   ├── DashboardPage.tsx
│   ├── TaskManagerPage.tsx
│   └── StudyCanvasPage.tsx
├── store/
│   └── layoutStore.ts      # Zustand store for layout state
├── types.ts                # TypeScript type definitions
├── App.tsx                 # Root component with routing
├── main.tsx                # Entry point
└── index.css               # Global styles

```

## Key Features Implementation

### Real-time Synchronization
The `useRealtimeSync` hook subscribes to mock WebSocket messages and automatically updates React Query cache when updates arrive from:
- **Pronote**: Task status changes
- **Google Docs**: Document content updates
- **AI**: New insights and recommendations

### Optimistic Updates
Task and subtask updates use optimistic UI patterns, immediately reflecting changes in the UI while the API request is in flight.

### Layout Flexibility
The app demonstrates both fixed and customizable layout modes. The customizable mode is documented for future drag-and-drop functionality.

## Routes

- `/dashboard` - Proactive AI Dashboard
- `/tasks` - Task Manager with grouped views
- `/canvas` - Study Session Canvas (full-screen)

## Acceptance Criteria

✅ Page routes demonstrate each interface (Dashboard, Task Manager, Canvas)  
✅ Layout toggles between fixed and customizable modes (documented)  
✅ All interactions call mocked backend endpoints without errors  
✅ Real-time sync via WebSocket mock reflects Pronote, Google, and AI data  
✅ Responsive design with dark mode support  
✅ TypeScript for type safety  
✅ Organized component structure

## Development Notes

### Mock Data
All data is currently mocked. To integrate with real backends:
1. Replace `mockApi.ts` functions with actual API calls
2. Update `mockSocket.ts` with real Socket.io connection
3. Configure environment variables for API endpoints

### Styling
The app uses CSS variables for theming, supporting light and dark modes automatically based on system preferences.

### Future Enhancements
- Storybook integration for component documentation
- Drag-and-drop layout customization
- Real backend integration
- User authentication
- Persistent user preferences
- Advanced AI features

## License

MIT
