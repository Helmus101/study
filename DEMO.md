# Demo Guide

This document provides a walkthrough of the Proactive AI Study Workspace features.

## Starting the Application

```bash
npm install
npm run dev
```

Navigate to `http://localhost:5173` in your browser.

## Page Routes & Features

### 1. Dashboard (`/dashboard`)

The dashboard provides an AI-powered overview of your study activities.

**Features:**
- **Analytics Section**: Displays metrics including:
  - Focus Score (78%)
  - Energy Level (65%)
  - Pronote Sync Level (95%)
  - Google Docs Synced (12)
  - AI Insights Today (8)

- **Daily Plan Cards**: Three time-based blocks:
  - Morning Focus Block (09:00 - 3 tasks, Mathematics)
  - Collaboration Time (14:00 - 2 tasks, Essay Writing)
  - Review & Consolidate (18:30 - 4 tasks, Mixed Subjects)

- **Smart Feed**: Real-time insights from:
  - Pronote (upcoming exams, homework)
  - Google Docs (collaborative updates)
  - AI (scheduling recommendations, knowledge gaps)

**Live Features:**
- Real-time updates via WebSocket mock (new insights appear every ~7 seconds)
- Click "Review Now" or "Launch focus block" to see mock API calls in console

### 2. Task Manager (`/tasks`)

Comprehensive task organization with AI-powered features.

**Features:**
- **Four Buckets**:
  - Today: Urgent tasks due today
  - This Week: Plan ahead items
  - Upcoming: Future scheduled work
  - Overdue: Late items from Pronote

- **Task Card Features**:
  - Checkboxes to mark tasks complete (optimistic UI)
  - Priority badges (low/medium/high)
  - Pronote badges for school-synced tasks
  - Course information
  - Google Doc indicators

- **AI-Generated Subtasks**:
  - Click "AI Subtasks" to expand
  - Shows confidence scores (e.g., "90% confidence")
  - Individual subtask checkboxes
  - Source indication (Pronote/Google/AI)

- **Layout Toggle**:
  - Switch between "Fixed Layout" and "Customizable (beta)"
  - Customizable mode is documented as a future feature

**Try It:**
1. Click checkboxes to mark tasks/subtasks complete
2. Watch console for mock API calls
3. Toggle layout modes to see different grid arrangements

### 3. Study Canvas (`/canvas`)

Full-screen immersive study workspace.

**Layout Components:**

#### Left Sidebar: AI Assistant
- Context-aware suggestions based on your work
- Input field to ask questions
- Real-time responses (mocked)
- Displays: "AI is thinking about: [your prompt]" in console

#### Center: Document Editor
- Google Doc mirror with live content
- Edit in textarea
- "Save Changes" button appears when editing
- Real-time sync indicator
- WebSocket updates append to content automatically

#### Right Panel
- **Mini Calendar**: Next 3 days with focus areas and workload bars
- **Task Checklist**: Project-specific tasks
  - Click checkboxes to mark complete
  - Strikes through completed items

#### Bottom: Environment Controls
Three control sections:
1. **Study Music**: Shows current track, "Switch" button
2. **Pomodoro Timer**: Shows phase (Focus/Break) and time remaining
3. **Scene**: Current environment (Cozy Library, Forest Focus, etc.)

#### Middle Bottom: File Viewer
- Attached documents and references
- Shows file type icons (PDF, slides, docs)
- Last updated timestamps

#### Bottom Panels: Flashcards & Quiz
- **Flashcards**:
  - Click card to flip (reveal answer)
  - Navigation arrows for multiple cards
  - Confidence indicators (solid/wobbly/unknown)
  
- **Quiz Preview**:
  - Multiple choice questions
  - Click options to select (mocked)
  - AI-generated from study content

**Try It:**
1. Edit the document content and click "Save Changes"
2. Ask the AI Assistant a question
3. Toggle checklist items
4. Switch music, Pomodoro phase, or scene
5. Navigate through flashcards
6. Wait for WebSocket updates (auto-appends to document every ~7 seconds)

## Testing Real-Time Sync

The app uses a mock WebSocket that emits updates every ~7 seconds:

1. **On Dashboard**: New AI insights appear in the Smart Feed
2. **On Tasks Page**: Task statuses may update from external sources
3. **On Canvas**: Document content gets appended with timestamps

Watch the browser console to see when these events fire.

## Mock API Endpoints

All interactions call mocked endpoints. Check browser console to see:

```
Mock API: Updated task t1 to done
Mock API: Updated subtask s3 in task t1 to true
Mock API: Updated doc gdoc-123 with 234 characters
Mock API: Updated checklist item c3 to true
Mock API: Updated environment {music: "Lo-fi Beta Mix"}
Mock API: AI prompt processed {prompt: "Summarize last section..."}
```

## Layout Modes

Toggle between two modes using the dropdown:

1. **Fixed Layout**: 
   - Locked sections for focused work
   - Optimal for production use

2. **Customizable (beta)**:
   - Demonstrates potential future feature
   - Currently adjusts grid behavior
   - Documentation indicates drag-and-resize will be added

## Dark Mode

The app automatically adapts to your system's color scheme preference:
- Light mode: Clean, bright interface
- Dark mode: Comfortable for extended study sessions

## Architecture Highlights

- **React Query**: Automatic caching, background refetching
- **Optimistic Updates**: UI updates before server confirms
- **WebSocket Integration**: Real-time bidirectional sync (mocked)
- **Type Safety**: Full TypeScript coverage
- **Responsive Design**: Works on desktop, tablet, and mobile

## Production Integration Checklist

When connecting to real backends:

- [ ] Replace `src/api/mockApi.ts` with actual API calls
- [ ] Configure Socket.io client in `src/api/mockSocket.ts`
- [ ] Add authentication flow
- [ ] Set up environment variables
- [ ] Configure CORS for API endpoints
- [ ] Add error boundaries for production
- [ ] Implement data persistence
- [ ] Add user preferences storage
