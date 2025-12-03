# Decision #2: Mini-Calendar UI Architecture

## Context

We need to implement a mini-calendar interface that displays merged events from Pronote and Google Calendar, along with exam countdowns and task schedules. Two approaches have been prototyped:

1. **Fixed Canvas Layout**: A predetermined grid structure with specific positions for each component
2. **User-Customizable Layout**: A draggable widget system allowing users to arrange their dashboard

## Prototypes

### Prototype A: Fixed Canvas Layout
**Location**: `prototypes/mini-calendar-fixed.html`

**Description**: 
- Fixed 2-column grid layout
- Left sidebar: Monthly calendar view (300px)
- Right column: Exam countdown (top) + Event list (bottom)
- Responsive within defined breakpoints
- No user customization of layout

**Implementation Complexity**: ⭐⭐ (Low-Medium)

### Prototype B: Customizable Layout
**Location**: `prototypes/mini-calendar-customizable.html`

**Description**:
- 12-column CSS Grid system
- Drag-and-drop widgets
- Multiple preset layouts (Compact, Student, Focus, Custom)
- User can resize and reposition all components
- Layout preferences saved to user profile

**Implementation Complexity**: ⭐⭐⭐⭐ (High)

## Comparison Matrix

| Criteria | Fixed Canvas | Customizable Layout |
|----------|--------------|---------------------|
| **Development Time** | 2-3 days | 7-10 days |
| **Maintenance Cost** | Low | Medium-High |
| **User Flexibility** | None | High |
| **Mobile Responsiveness** | Easier (predefined breakpoints) | Complex (need responsive grid) |
| **Accessibility** | Easier to ensure | Requires careful ARIA implementation |
| **Performance** | Excellent (static layout) | Good (requires state management) |
| **User Learning Curve** | Minimal | Medium (requires tutorial) |
| **Visual Consistency** | Guaranteed | Depends on user choices |

## Technical Implications

### Fixed Canvas Approach

**Pros:**
- Simple CSS Grid implementation
- Predictable layouts for all users
- Easier to optimize for different screen sizes
- Faster initial load and render
- No need for layout state persistence
- Easier automated testing

**Cons:**
- Limited user personalization
- May not fit all user workflows
- Harder to add new widgets later
- Less engaging for power users

**Tech Stack:**
- CSS Grid with predefined template areas
- React components with fixed props
- Standard responsive breakpoints

### Customizable Layout Approach

**Pros:**
- Highly personalized user experience
- Can accommodate diverse workflows
- More engaging and modern UX
- Easy to add new widget types
- Better for power users and long-term engagement

**Cons:**
- Complex state management (Redux/Zustand)
- Need to persist layout preferences per user
- Drag-and-drop library needed (react-grid-layout, dnd-kit)
- More complex responsive logic
- Requires user onboarding/tutorial
- More edge cases to handle
- Harder to ensure accessibility

**Tech Stack:**
- react-grid-layout or dnd-kit for drag-and-drop
- Redux or Zustand for layout state
- Database schema for user preferences
- Preset templates as JSON configs

## Database Impact

### Fixed Canvas
No additional database requirements.

### Customizable Layout
Requires new table:

```sql
CREATE TABLE user_dashboard_layouts (
  user_id TEXT PRIMARY KEY,
  layout_config JSONB NOT NULL,
  preset_name TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Recommendations

### Phased Approach (RECOMMENDED)

**Phase 1 (MVP - Week 1-2)**: Implement Fixed Canvas Layout
- Get core functionality working quickly
- Validate data merging from Pronote + Google
- Gather user feedback on information hierarchy
- Deploy to production faster

**Phase 2 (Enhancement - Week 4-6)**: Add Preset Layouts
- Create 2-3 preset layouts (Student, Focus, Compact)
- Allow switching between presets
- No drag-and-drop yet, but test different arrangements

**Phase 3 (Future - Week 8+)**: Implement Full Customization
- Add drag-and-drop functionality
- Implement widget resizing
- Save user preferences
- Add widget marketplace/library

### Decision Factors

**Choose Fixed Canvas if:**
- Timeline is tight (< 2 weeks)
- Budget is limited
- User base is small or homogeneous
- Mobile-first approach is critical
- Simplicity is valued over flexibility

**Choose Customizable Layout if:**
- User personalization is a key differentiator
- Long-term product with evolving features
- Power users are primary audience
- Budget allows for 2-3x development time
- Have resources for ongoing UX refinement

## Final Decision

**RECOMMENDED: Start with Fixed Canvas (Phase 1)**

**Rationale:**
1. **Time to Market**: Get MVP out 2-3x faster
2. **Risk Mitigation**: Validate core data integration first
3. **User Feedback**: Learn what users actually need before building flexibility
4. **Technical Debt**: Can refactor to customizable later without wasting work
5. **Mobile First**: Fixed layout is more mobile-friendly by default
6. **Accessibility**: Easier to ensure WCAG compliance

**Migration Path:**
- Build with modular widget components from day one
- Use CSS Grid with named template areas (easy to make dynamic later)
- Design API responses to be layout-agnostic
- Document component interfaces for future drag-and-drop integration

## Implementation Notes

### For Fixed Canvas MVP:

```typescript
// Component structure
<MiniCalendar>
  <MonthView />
  <ExamCountdown />
  <EventList events={mergedEvents} />
</MiniCalendar>

// CSS Grid Template
.mini-calendar {
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "month countdown"
    "month events";
}
```

### For Future Customizable Version:

```typescript
// Widget registry
const widgetTypes = {
  monthView: MonthViewWidget,
  examCountdown: ExamCountdownWidget,
  eventList: EventListWidget,
  quickStats: QuickStatsWidget
};

// User layout config
interface LayoutConfig {
  widgets: Array<{
    id: string;
    type: keyof typeof widgetTypes;
    position: { x: number; y: number };
    size: { w: number; h: number };
  }>;
}
```

## Success Metrics

**Phase 1 (Fixed Canvas):**
- Time to first render < 300ms
- Mobile usage > 40%
- User satisfaction > 4.0/5.0
- Event merge accuracy 100%

**Phase 3 (Customizable):**
- % of users who customize layout > 30%
- Average customizations per user > 2
- Layout load time < 500ms
- Widget drag latency < 100ms

## Related Decisions

- [DECISION-001]: Google OAuth implementation
- [DECISION-003]: Calendar event merging strategy (to be created)
- [DECISION-004]: Mobile responsive breakpoints (to be created)

## References

- Prototype A: `/prototypes/mini-calendar-fixed.html`
- Prototype B: `/prototypes/mini-calendar-customizable.html`
- React Grid Layout: https://github.com/react-grid-layout/react-grid-layout
- DnD Kit: https://dndkit.com/

---

**Status**: ✅ DECIDED - Fixed Canvas for MVP  
**Decision Date**: December 2024  
**Review Date**: After 3 months of user feedback  
**Decision Owner**: Development Team
