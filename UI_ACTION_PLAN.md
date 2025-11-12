# AgentBuddy Phase 1 - UI & Action Plan

## 🎨 Theme: Cyber Pulse
- **Background**: `#0b0f17` (dark graphite)
- **Primary Accent**: `#00e0ff` (cyan)
- **Secondary Accent**: `#9b5cff` (vivid purple)
- **CTA/Highlight**: `#ff007a` (neon pink)
- **Glass Cards**: `rgba(255,255,255,0.02)` with subtle borders
- **Typography**: Inter font family

---

## 📄 UI Pages & Components

### 1. **Landing Page** (`/`)
**Location**: `apps/web/src/app/page.tsx`

**UI Elements**:
- Hero section with "Welcome to AgentBuddy" title
- "Get Started" CTA button (pink→purple gradient)
- Agent showcase cards (DevAgent, DesignAgent, DeployAgent)
- "How It Works" section with 3-step process
- Navigation header (Home, Dashboard links)

**Actions**:
- ✅ Click "Get Started" → Redirects to `/dashboard`
- ✅ Click "Go to Dashboard" → Redirects to `/dashboard`
- ✅ Navigation links in header

**Status**: ✅ Complete

---

### 2. **Dashboard Page** (`/dashboard`)
**Location**: `apps/web/src/app/dashboard/page.tsx`

**UI Elements**:
- **Left Sidebar** (New Task Form):
  - Task Name input field
  - Agent Type dropdown (DevAgent, DesignAgent, DeployAgent)
  - GitHub URL input (optional)
  - "Assign Task" button (gradient CTA)
  
- **Main Content Area**:
  - **Agent Status Section**: Grid of 3 agent cards showing:
    - Agent name (DevAgent-001, DesignAgent-001, DeployAgent-001)
    - Status badge (idle/busy/offline) with color coding
    - Agent type icon
  
  - **Task Queue Section**: List of all tasks showing:
    - Task name
    - Assigned agent
    - Status badge (pending/in-progress/completed/failed)
    - Color-coded status indicators

**Actions**:
- ✅ **Create Task**: 
  - Fill form → Click "Assign Task"
  - Creates task in Supabase via `POST /api/tasks`
  - Auto-redirects to `/task/:id` page
  - Updates task list in real-time

- ✅ **View Tasks**: 
  - Fetches all tasks on load via `GET /api/tasks`
  - Displays in chronological order (newest first)
  - Shows status with color coding:
    - **Pending**: Muted gray
    - **In Progress**: Purple `#9b5cff`
    - **Completed**: Cyan `#00e0ff`
    - **Failed**: Pink `#ff007a`

- ✅ **View Agents**: 
  - Fetches agent status via `GET /api/agents`
  - Displays agent availability and status

**Status**: ✅ Complete

---

### 3. **Task Detail Page** (`/task/:id`)
**Location**: `apps/web/src/app/task/[id]/page.tsx`

**UI Elements**:
- **Task Header Card**:
  - Task ID
  - Status badge (color-coded)
  - Agent type
  - Preview URL link (if available)

- **Logs Section**:
  - Terminal-style log viewer
  - Monospace font
  - Dark background
  - Real-time log updates

**Actions**:
- ✅ **Auto-trigger Agent**: 
  - If task status is "pending", automatically calls `POST /api/agent/run`
  - Starts the agent execution process

- ✅ **Real-time Updates**: 
  - Polls `GET /api/tasks/:id` every 2 seconds
  - Updates status, logs, and output in real-time
  - Shows progress: pending → in_progress → completed/failed

- ✅ **Display Logs**: 
  - Shows agent execution logs as they come in
  - Displays preview URL when task completes

**Status**: ✅ Complete

---

### 4. **Login Page** (`/login`)
**Location**: `apps/web/src/app/(auth)/login/page.tsx`

**UI Elements**:
- Simple glass card
- "Sign in" heading
- "Continue with Google" button (gradient CTA)

**Actions**:
- ⚠️ **Google OAuth**: 
  - Button triggers Supabase Google OAuth
  - Currently stubbed (needs Google OAuth credentials)
  - Should redirect after successful auth

**Status**: ⚠️ Partial (needs Google OAuth setup)

---

### 5. **Global Layout** (`layout.tsx`)
**Location**: `apps/web/src/app/layout.tsx`

**UI Elements**:
- Global header with:
  - "AgentBuddy" logo/brand
  - Navigation links (Home, Dashboard)
- Wraps all pages with consistent styling
- Applies Cyber Pulse theme globally

**Actions**:
- ✅ Navigation between pages
- ✅ Consistent header across all pages

**Status**: ✅ Complete

---

## 🔄 User Flow & Action Sequences

### **Flow 1: Create & Execute Task**
```
1. User visits Landing Page (/)
   → Clicks "Get Started"
   
2. User lands on Dashboard (/dashboard)
   → Sees agent status and task queue
   
3. User creates new task:
   → Fills task name
   → Selects agent type (e.g., DeployAgent)
   → (Optional) Adds GitHub URL
   → Clicks "Assign Task"
   
4. Backend creates task:
   → POST /api/tasks → Supabase
   → Returns task ID
   
5. Frontend redirects to Task Detail (/task/:id)
   → Auto-triggers agent: POST /api/agent/run
   
6. Backend orchestrates:
   → Updates task status to "in_progress"
   → Calls DeployAgent service (Python FastAPI)
   → DeployAgent simulates deploy, returns logs + preview URL
   → Backend updates Supabase with logs and output
   
7. Frontend polls every 2 seconds:
   → GET /api/tasks/:id
   → Updates UI with:
     - Status changes (pending → in_progress → completed)
     - Real-time logs
     - Preview URL when done
```

### **Flow 2: View Existing Tasks**
```
1. User visits Dashboard (/dashboard)
   → Fetches all tasks: GET /api/tasks
   → Displays in task queue
   
2. User clicks on a task (if implemented)
   → Navigates to /task/:id
   → Views task details and logs
```

### **Flow 3: Monitor Agent Status**
```
1. User visits Dashboard (/dashboard)
   → Fetches agents: GET /api/agents
   → Displays agent cards with status
   → Updates on page refresh
```

---

## 🎯 API Endpoints Used

### **Frontend → Backend**
- `GET /api/health` - Health check
- `GET /api/tasks` - List all tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `POST /api/agent/run` - Trigger agent execution
- `GET /api/agents` - Get agent status list

### **Backend → DeployAgent (Python)**
- `GET /health` - Health check
- `POST /run` - Execute deploy simulation

---

## 🚀 Current Implementation Status

### ✅ **Completed**
- Landing page with hero and agent showcase
- Dashboard with task creation form
- Task detail page with real-time updates
- Agent status display
- Task queue with status indicators
- Cyber Pulse theme applied
- Real-time polling for task updates
- Auto-trigger agent on task creation
- Supabase integration for persistence

### ⚠️ **Partial**
- Login/Auth (UI exists, needs Google OAuth credentials)
- Socket.io real-time (currently using polling)

### ❌ **Not Implemented**
- User authentication guards (routes are public)
- Task filtering/search
- Task deletion/cancellation
- Agent management UI
- Settings/preferences page
- Dark/light mode toggle (only dark mode)
- Task retry functionality
- Export logs/download artifacts

---

## 📊 Status Color Coding

| Status | Color | Hex Code | Usage |
|--------|-------|----------|-------|
| **Pending** | Muted Gray | `rgba(230, 238, 248, 0.6)` | Task waiting to start |
| **In Progress** | Purple | `#9b5cff` | Task actively running |
| **Completed** | Cyan | `#00e0ff` | Task finished successfully |
| **Failed** | Neon Pink | `#ff007a` | Task encountered error |
| **Idle** | Cyan | `#00e0ff` | Agent available |
| **Busy** | Purple | `#9b5cff` | Agent working |
| **Offline** | Neon Pink | `#ff007a` | Agent unavailable |

---

## 🎨 UI Component Library

### **Reusable Components**
- `.glass-card` - Glassmorphic card with subtle transparency
- `.btn-cta` - Gradient button (pink → purple) with glow
- `.form-input` - Styled input with Cyber Pulse borders
- `.container-max` - Max-width container (1200px)

### **Status Helpers**
- `getStatusInfo()` - Returns color, icon, and background for status
- `getAgentIcon()` - Returns appropriate icon for agent type

---

## 🔮 Future Enhancements (Phase 2+)

1. **Real-time with Socket.io** - Replace polling with WebSocket
2. **Task Management** - Edit, delete, retry tasks
3. **Advanced Filtering** - Filter by status, agent, date
4. **User Profiles** - User settings, preferences
5. **Agent Configuration** - Configure agent behavior
6. **Analytics Dashboard** - Task completion rates, agent performance
7. **Notifications** - Toast notifications for task updates
8. **Export/Download** - Download logs, artifacts
9. **Multi-user Support** - Team collaboration features
10. **API Documentation** - Swagger/OpenAPI docs

---

## 📝 Notes

- All pages use Cyber Pulse theme consistently
- Polling interval: 2 seconds for task updates
- Max content width: 1200px
- Base spacing: 24px
- Border radius: 8px for cards
- Font: Inter (weights 400, 600, 800)

