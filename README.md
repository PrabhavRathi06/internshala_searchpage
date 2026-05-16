# Internshala Search Page Clone

> A high-fidelity, responsive clone of the Internshala internship search page built with React and Vite.

## Live Links

- **Frontend**: `[Add Live Link Here]`
- **Demo Video**: `[Add Demo Video Link Here]`

---

## Features

- **Pixel-Perfect UI**: Matches the real Internshala design closely, including complex mega-menus and custom filter components.
- **Dynamic Filtering**: Client-side filtering by Profile, Location, Max Duration, and Minimum Stipend.
- **Custom Components**: Includes custom-built date pickers and dropdowns instead of native browser elements for a consistent look.
- **Responsive Design**: Adapts beautifully to mobile, tablet, and desktop screens with a mobile-specific bottom navigation bar and filter menus.
- **Pagination**: Manages large sets of data by displaying 5 internships per page with intuitive navigation.
- **Real Data**: Uses actual internship data from the Internshala API.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend UI** | React 18, Vite |
| **Styling** | Plain CSS |
| **Icons** | lucide-react |
| **HTTP Client**| Axios |

---

## Project Structure

```text
internshala_searchpage/
├── public/                 # Static assets
├── src/
│   ├── App.jsx             # Main application component & layout (header/footer)
│   ├── index.css           # Global styles, variables, and responsive media queries
│   ├── main.jsx            # React rendering entry point
│   ├── components/         # Reusable UI components
│   │   ├── FilterPanel.jsx # Sidebar component for search criteria
│   │   ├── InternshipCard.jsx # Individual internship listing
│   │   └── InternshipList.jsx # Paginated list of internships
│   └── styles/             # Component-specific stylesheets
│       ├── FilterPanel.css
│       ├── InternshipCard.css
│       └── InternshipList.css
└── vite.config.js          # Vite build configuration
```

---

## Local Setup Instructions

### Prerequisites
- Node.js 18+

### 1. Frontend Setup
```bash
# Clone the repository
git clone <your-repository-url>
cd internshala_searchpage

# Install required dependencies
npm install

# Start the development server
npm run dev
```
> **Frontend App:** `http://localhost:5173`

---

## Assumptions & Additional Features

- **Styling Choice**: I used plain CSS instead of a framework like Tailwind to show strong fundamental CSS skills, strictly following the assignment requirements.
- **Custom UI Controls**: To achieve pixel-perfect parity with Internshala, native HTML inputs (like `<select>` and `<input type="date">`) were replaced with fully custom React components.
- **Component Structure**: The UI is broken down into modular, reusable React components (`FilterPanel`, `InternshipCard`, `InternshipList`) to keep the codebase clean and maintainable.

---
*Developed by Prabhav Rathi.*
