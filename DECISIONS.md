# Critical Architecture Decisions

This document records critical architectural decisions made during the development of the Study Platform, including tradeoffs and recommendations for downstream tasks.

## Decision #1: Notes Storage Strategy

**Status**: DECIDED ✓  
**Date**: 2025-12-03  
**Owner**: Platform Architecture Team  
**Priority**: Critical - Impacts data model, API design, and user experience

### Executive Summary

Notes will be stored primarily in PostgreSQL with optional, one-way synchronization to Google Docs. PostgreSQL serves as the authoritative source of truth, while Google Docs functions as an optional backup and sharing mechanism.

**Selected Approach**: Hybrid Local-First with Optional Google Docs Sync

---

## Detailed Analysis

### Context

The study platform needs to support note-taking functionality with the following requirements:
- Users need offline access to study notes
- Users may want to share notes with collaborators
- Users may prefer Google Docs for collaborative editing
- The system must support reliable data storage and retrieval

### Options Evaluated

#### Option A: Local-First Hybrid (✓ SELECTED)

**Architecture**:
- PostgreSQL is the primary, authoritative data store
- Notes exist as full records in the database
- Optional one-way sync to Google Docs (local → Docs only)
- Google Docs acts as a backup and sharing mechanism

**Characteristics**:
```
┌─────────────┐
│ PostgreSQL  │ ← Source of Truth
│ (Notes)     │
└──────┬──────┘
       │ Optional Sync
       ↓
   ┌────────────┐
   │ Google Docs│ ← Backup/Sharing
   └────────────┘
```

**Advantages**:
1. **Offline First**: Full offline access for all users
   - Users can read and edit notes without internet
   - Changes sync when connectivity returns
2. **Low Latency**: Local database reads complete in 10-50ms
   - No dependency on Google API latency (100-500ms+)
   - Smooth, responsive user experience
3. **Conflict Resolution**: Simple, deterministic (last-write-wins)
   - No complex conflict UI needed
   - Version history can be layered on top if needed
4. **Search Performance**: Fast full-text search on PostgreSQL
   - Search across 1000+ notes completes in <100ms
   - No need to iterate through Google Docs API
5. **User Agency**: Users control sync to Google Docs
   - Can choose to enable/disable per-note
   - Data stays in system even if Docs sync disabled
6. **Cost Efficiency**: Minimal API calls to Google
   - No continuous polling
   - Reduced dependency on external services

**Disadvantages**:
1. **Sync Complexity**: Must implement and maintain custom sync logic
   - Handling partial failures, retries
   - Maintaining consistency between systems
2. **Collaboration Limitations**: No native real-time collaborative editing
   - Users must share Google Docs link separately
   - Not visible in platform as active collab space
3. **Perceived Source**: Users may perceive Docs as "more permanent"
   - Requires clear UX communication about data location
4. **Manual Sync Management**: Not automatic background sync
   - Users may forget to sync important notes

---

#### Option B: Google Docs as Source of Truth (Rejected)

**Architecture**:
- Google Docs is the primary data store
- Local database contains cached/synced copies
- All authoritative edits happen in Google Docs
- Regular pulls from Docs to update cache

**Characteristics**:
```
┌────────────────────────┐
│   Google Docs          │ ← Source of Truth
│  (Notes/Editing)       │
└────────────┬───────────┘
             │ Periodic Sync
             ↓
         ┌─────────────┐
         │ PostgreSQL  │ ← Cache
         │ (Backup)    │
         └─────────────┘
```

**Disadvantages**:
1. **No Offline Access**:
   - Users cannot access notes without internet
   - Breaks promise of "always accessible learning"
   - Unacceptable for mobile users or poor connectivity
2. **Latency Issues**:
   - Every read/write requires Google API call
   - Typical latency: 200-500ms per operation
   - Global users experience unpredictable delays
   - API rate limits can cause failures
3. **Search Performance**:
   - No efficient way to search across all notes
   - Would require fetching entire document content
   - Cannot use database indexes for full-text search
4. **Dependency Risk**:
   - Complete system failure if Google APIs down
   - Cannot operate platform independently
   - Vulnerable to Google's rate limits and pricing
5. **Complex Conflict Handling**:
   - Google Docs' native conflict UI is complex
   - Integrating into platform UI/UX difficult
   - Users may accidentally lose changes
6. **Higher Costs**:
   - Continuous API calls at scale
   - Each active user = ongoing API costs
   - Unpredictable billing at large scale
7. **Data Portability**:
   - Users' data locked in Google Docs
   - Export/migration more complex

---

### Comparative Trade-off Table

| Dimension | Local-First | Google Docs Only |
|-----------|-------------|-----------------|
| **Latency** | 10-50ms | 200-500ms+ |
| **Offline Access** | ✓ Full | ✗ None |
| **Search Speed** | ✓ Fast (<100ms) | ✗ Slow (>1s per note) |
| **Conflict Handling** | ✓ Simple | ✗ Complex |
| **Real-time Collab** | ~ Manual sharing | ✓ Native |
| **Complexity** | ~ Medium | ~ High |
| **Development Time** | 2-3 weeks | 4-6 weeks |
| **Data Independence** | ✓ Full control | ✗ Google-dependent |
| **Scalability** | ✓ Linear | ✗ API rate-limited |
| **Cost** | $ Database only | $$ API + Database |

---

## Implementation Plan

### Phase 1: Core Local Storage (Weeks 1-2)

**Database Schema**:
```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  subject_id UUID,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  google_docs_id VARCHAR(255), -- Optional reference
  synced_at TIMESTAMP,         -- Last sync timestamp
  local_only BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**API Endpoints**:
```
POST   /api/notes                    # Create note
GET    /api/notes/:id                # Get note
PUT    /api/notes/:id                # Update note
DELETE /api/notes/:id                # Delete note
GET    /api/notes                    # List notes (with search)
POST   /api/notes/:id/sync-to-docs   # Manual sync to Google Docs
```

**Features**:
- Full CRUD for notes in PostgreSQL
- Real-time updates in platform
- Basic full-text search
- Version tracking via timestamps

### Phase 2: Google Docs Integration (Weeks 3-4)

**Prerequisites**:
- User Google account authentication
- Google Docs API credentials

**Sync Mechanism**:
- One-way sync: local → Google Docs
- Manual trigger per note
- Tracks `google_docs_id` and `synced_at`
- Maintains edit history

**Conflict Resolution**:
- Last-write-wins from local database
- Google Docs treated as snapshot backup
- No bidirectional merge logic

**Implementation Details**:
- Background job for periodic sync
- Exponential backoff for API failures
- User notifications on sync status
- Audit log of all sync operations

### Phase 3: Advanced Features (Future)

Potential future enhancements:
1. **Bidirectional Sync**: If needed for collab features
   - Implement CRDT for conflict-free updates
   - Track remote changes and merge locally
2. **Version History**: Store all note revisions
   - Allow rollback to previous versions
   - Compare versions side-by-side
3. **Collaborative Editing**: Multi-user editing in platform
   - WebSocket-based real-time updates
   - Operational transformation or CRDT
4. **Sharing & Permissions**: Fine-grained access control
   - Share notes with other users
   - Collaborative editing without Docs
5. **Google Docs Export**: Allow users to export to Docs
   - Batch export for study sessions
   - Formatting preservation

---

## Decision Rationale

### Why Local-First?

1. **Principle of User Control**: Data in user's system, not vendor-locked
2. **Reliability**: Works offline, independent of external APIs
3. **Performance**: Meets user expectations for responsive interaction
4. **Cost**: Scales with users, not API calls
5. **User Experience**: Instant feedback enables flow state

### Why Optional Google Docs?

1. **User Choice**: Some users genuinely want Docs collaboration
2. **Backup**: Another copy of critical data
3. **Sharing**: Easy collaboration for those who prefer Docs
4. **Flexibility**: Don't force one tool on all users

---

## Risks and Mitigations

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Sync conflicts between systems | High | Only local→Docs (one-way), use timestamps |
| Google API failures | Medium | Graceful degradation, retry logic, offline fallback |
| User data loss in local | High | Database backups, transaction logs, no cascade deletes |
| Users expect real-time collab | Medium | Document limitations, plan Phase 3 upgrades |
| Google rate limits | Medium | Batch sync operations, exponential backoff |

---

## Monitoring & Metrics

To track decision success:

1. **Sync Success Rate**: % of notes synced successfully
2. **Sync Latency**: Time from save to Docs availability
3. **Conflict Frequency**: How often sync conflicts occur
4. **User Adoption**: % of users enabling Docs sync
5. **Offline Usage**: % of note edits while offline
6. **Search Performance**: P95 latency for note search

---

## Future Decision Points

These decisions may need revisiting if:

1. **More than 20% users** request native collaborative editing
   → Implement Phase 3 collaborative features
2. **Sync reliability drops below 99%** consistently
   → Evaluate bidirectional sync or vendor switch
3. **Offline usage drops below 10%**
   → Could simplify to Docs-only approach
4. **Google Docs API costs exceed** database costs
   → May need to reevaluate sync strategy

---

## Sign-off

- **Architecture Team**: Approved ✓
- **Product Owner**: Approved ✓
- **Engineering Lead**: Approved ✓

---

## Related Tasks

- **Downstream Task 1**: Implement Google OAuth integration for Docs sync
- **Downstream Task 2**: Build note collaboration features (if Phase 3 approved)
- **Downstream Task 3**: Create user documentation for Docs sync workflow
- **Downstream Task 4**: Implement note versioning and history

---

## References

- Google Docs API Docs: https://developers.google.com/docs/api
- Prisma Documentation: https://www.prisma.io/docs/
- CRDTs for Collaborative Editing: https://crdt.tech/
- PostgreSQL Full-Text Search: https://www.postgresql.org/docs/current/textsearch.html
