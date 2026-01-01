# Anqer Lead-Magnet App

## Overview
Anqer is a lead-magnet application built around the "snapshot vs memory" value proposition. Users get immediate value through one-time snapshot analysis, then recognize the need for continuity and memory features.

## Core Strategy
- **Immediate Value**: Users can search and analyze any person/entity instantly
- **Value Recognition**: After seeing the snapshot, users understand the limitation
- **Non-Pushy Conversion**: 3 strategic waitlist capture moments that feel natural

## Pages & User Flow

### 1. Home Page (`/anqer`)
- Clean search interface
- Hero messaging: "Get the current context"
- Submit triggers mock API analysis with realistic delay
- Shows loading state with "Analyzing current context..." message
- Second search triggers recognition popup (non-blocking)

### 2. Results Page (`/anqer/results`)
- Displays snapshot analysis:
  - Summary
  - Key points (bullet list)
  - Sources with attribution and links
- Action buttons (trigger soft walls):
  - Save Snapshot
  - Monitor Changes
  - Add Private Note
- Bottom CTA section:
  - "This is a one-time snapshot"
  - Email capture: "Want Anqer to remember this person for you?"
  
### 3. Waitlist Page (`/anqer/waitlist`)
- Before submission:
  - Headline: "Memory is limited. Anqer is not."
  - Body copy about snapshots → memory
  - Email input (no password)
  - "Request Access" button
- After submission:
  - Confirmation with checkmark
  - "You're in. We'll notify you when memory unlocks."
  - Shows submitted email
  - Context: "[Person] will be waiting for you"
  - What happens next section

## Waitlist Capture Points

### 1. Primary CTA (Results Page Bottom)
- Appears after user views snapshot
- Natural transition after seeing the value
- Clear messaging about snapshot vs memory
- Direct email input with "Remember" button

### 2. Soft Wall Modals
Triggered when user tries to:
- Save the snapshot
- Monitor for changes
- Add private notes

Modal explains why the feature requires memory, offers waitlist signup.

### 3. Second Search Recognition
- Non-blocking popup appears bottom-right
- Triggers after 2nd search in same session
- Message: "Using Anqer like a memory tool?"
- Can dismiss or join waitlist

## Technical Implementation

### State Management (Zustand)
```typescript
// src/store/anqerStore.ts
- currentSnapshot: SnapshotResult | null
- searchHistory: SearchHistoryItem[]
- waitlistSubmission: WaitlistSubmission | null
- softWallType: 'save' | 'monitor' | 'note' | null
- emailConfirmationShown: boolean
- secondSearchRecognitionShown: boolean
```

### Mock API
```typescript
// src/api/mockApi.ts
- analyzeEntity(entityName: string): Promise<SnapshotResult>
  - 1.5 second delay for realism
  - Returns summary, key points, sources
  
- submitWaitlist(email: string, entityContext?: string): Promise<WaitlistSubmission>
  - 800ms delay
  - Returns submission with timestamp
  
- sendConfirmationEmail(email: string, entityName?: string): Promise<{ success: boolean }>
  - 500ms delay
  - Simulates email sending
```

### Components

#### SearchInterface
- Props: `onSearch`, `isLoading`
- Large input with search icon button
- Disabled state during loading
- Loading message appears below

#### ResultsDisplay
- Props: `result`, `onEmailCapture`, `onSoftWallTrigger`, `showEmailCapture`
- Displays all snapshot data with proper formatting
- Sources section with external link icons
- Three action buttons for soft walls
- Email capture form at bottom (conditional)

#### SoftWallModal
- Props: `type`, `entityName`, `onClose`, `onEmailSubmit`
- Modal overlay with backdrop
- Different content based on type (save/monitor/note)
- Email input with "Request Access" button
- "Not now" dismiss option

#### WaitlistForm
- Props: `onSubmit`, `isLoading`
- Brain icon header
- Hero headline and body copy
- Single email input
- "Request Access" submit button

#### EmailConfirmation
- Props: `email`, `entityName`
- Checkmark success icon
- "You're in" headline
- Shows submitted email
- Entity context if available
- "What happens next" section

#### SecondSearchRecognition
- Props: `onJoinWaitlist`, `onDismiss`
- Fixed position bottom-right
- Brain icon
- Brief message
- "Join Waitlist" button
- Dismissible

## Key Messaging Patterns

### Language Guidelines
- Say "Snapshot" not "Search"
- Say "Remember" not "Save"
- Say "Current context" not "Results"
- Say "Memory" not "History" or "Storage"
- Focus on continuity, not features

### Copy Examples
- "This is a one-time snapshot. Anqer becomes powerful when it remembers."
- "Want Anqer to remember this person for you?"
- "Memory is limited. Anqer is not."
- "Snapshots give you a moment. Memory gives you continuity."
- "[Person] will be waiting for you."

## Styling
- Uses existing CSS variable system
- Matches app's light/dark mode support
- Clean, minimal design
- Professional, trustworthy aesthetic
- Mobile responsive (flexbox/grid)
- Proper spacing and hierarchy

## Testing the Flow
1. Visit `/anqer`
2. Search for a person (e.g., "Elon Musk")
3. View snapshot results
4. Try clicking "Save Snapshot" → soft wall appears
5. Dismiss soft wall
6. Scroll to bottom → see primary CTA
7. Return to home and search again → recognition popup appears
8. Submit email on waitlist page → see confirmation

## Future Enhancements
- Real backend integration
- Actual email sending
- User authentication
- Saved snapshots
- Change monitoring
- Private notes
- Historical comparison
