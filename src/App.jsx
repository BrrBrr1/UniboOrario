import React, { useState, useEffect } from 'react';
import { addDays, startOfWeek, addWeeks, subWeeks, format, isSameDay } from 'date-fns';
import Header from './components/Header';
import WeekNavigator from './components/WeekNavigator';
import DayColumn from './components/DayColumn';
import CourseFilter from './components/CourseFilter';
import ViewToggle from './components/ViewToggle';
import DayTabs from './components/DayTabs';
import LoadingSkeleton from './components/LoadingSkeleton';
import OnlineStatus from './components/OnlineStatus';
import LessonFilter from './components/LessonFilter';
import { fetchTimetable } from './services/api';
import SettingsModal from './components/SettingsModal';
import './index.css';

// Base URL and params from user request
const BASE_URL = 'https://corsi.unibo.it/laurea/LingueTecnologieComunicazioneInterculturale/orario-lezioni/@@orario_reale_json';
const STATIC_PARAMS = 'anno=1&curricula=C60-000';

function App() {
  const [events, setEvents] = useState([]);
  const [availableLessons, setAvailableLessons] = useState([]);
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date('2025-11-24')); // Start from the new link's date
  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState('title'); // 'title', 'teacher', 'location'
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'day'
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Update document theme and persist to localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only update if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      // Calculate start (Monday) and end (Next Monday) for the current week
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = addWeeks(start, 1);

      const startStr = format(start, 'yyyy-MM-dd');
      const endStr = format(end, 'yyyy-MM-dd');

      const url = `${BASE_URL}?${STATIC_PARAMS}&start=${startStr}&end=${endStr}`;

      console.log('Fetching URL:', url); // For debugging

      const data = await fetchTimetable(url);

      // Extract unique lessons
      const uniqueLessonsMap = new Map();
      data.forEach(event => {
        if (!uniqueLessonsMap.has(event.cod_modulo)) {
          uniqueLessonsMap.set(event.cod_modulo, {
            cod_modulo: event.cod_modulo,
            title: event.title
          });
        }
      });
      const uniqueLessons = Array.from(uniqueLessonsMap.values());

      setAvailableLessons(uniqueLessons);

      // If no lessons are selected yet, select all by default
      if (selectedLessons.length === 0) {
        setSelectedLessons(uniqueLessons.map(l => l.cod_modulo));
      }

      setEvents(data);
      setLoading(false);
    };
    loadData();
  }, [currentDate]);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i)); // Mon-Fri

  // Navigation handlers
  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    if (mode === 'day') {
      const today = new Date();
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = addDays(weekStart, 6); // Sunday 00:00
      // Set weekEnd to end of day to include all of Sunday
      weekEnd.setHours(23, 59, 59, 999);

      // Check if today is within the currently viewed week
      if (today >= weekStart && today <= weekEnd) {
        setCurrentDate(today);
      } else {
        // If not, default to Monday of that week
        setCurrentDate(weekStart);
      }
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when typing in input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      switch (e.key) {
        case 'ArrowLeft':
          // Navigate to previous week
          setCurrentDate(prev => subWeeks(prev, 1));
          break;
        case 'ArrowRight':
          // Navigate to next week
          setCurrentDate(prev => addWeeks(prev, 1));
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
          // Jump to specific day (Mon-Fri)
          if (viewMode === 'day') {
            const dayIndex = parseInt(e.key) - 1;
            const currentWeekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
            const newDate = addDays(currentWeekStart, dayIndex);
            setCurrentDate(newDate);
          }
          break;
        case 'w':
        case 'W':
          // Switch to week view
          setViewMode('week');
          break;
        case 'd':
        case 'D':
          // Switch to day view
          handleViewModeChange('day');
          break;
        case 's':
        case 'S':
          // Open settings
          setIsSettingsOpen(true);
          break;
        case '/':
          // Focus search - find the filter input
          e.preventDefault();
          const filterInput = document.querySelector('.filter-input');
          if (filterInput) filterInput.focus();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, currentDate, handleViewModeChange]);

  // Advanced filter logic
  const filteredEvents = events.filter(event => {
    // First, filter by selected lessons
    if (!selectedLessons.includes(event.cod_modulo)) {
      return false;
    }

    // Then apply search filter
    if (!filter) return true;

    const searchLower = filter.toLowerCase();
    switch (filterType) {
      case 'title':
        return event.title.toLowerCase().includes(searchLower);
      case 'teacher':
        return event.docente?.toLowerCase().includes(searchLower);
      case 'location':
        const location = event.aule?.[0]?.des_risorsa || '';
        return location.toLowerCase().includes(searchLower);
      default:
        return true;
    }
  });

  return (
    <div className="app-container">
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />

      <main className="main-content">
        <div className="controls-section">
          <div className="top-controls">
            <WeekNavigator currentDate={currentDate} onDateChange={handleDateChange} />
            <ViewToggle viewMode={viewMode} onViewChange={handleViewModeChange} />
          </div>

          <LessonFilter
            lessons={availableLessons}
            selectedLessons={selectedLessons}
            onSelectionChange={setSelectedLessons}
          />

          <CourseFilter
            filter={filter}
            onFilterChange={setFilter}
            filterType={filterType}
            onFilterTypeChange={setFilterType}
          />

          {viewMode === 'day' && (
            <DayTabs currentDate={currentDate} onDateChange={handleDateChange} />
          )}
        </div>

        {loading ? (
          <LoadingSkeleton viewMode={viewMode} />
        ) : (
          <div className={`timetable-grid ${viewMode}`}>
            {viewMode === 'week' ? (
              weekDays.map(day => (
                <DayColumn
                  key={day.toISOString()}
                  date={day}
                  events={filteredEvents}
                />
              ))
            ) : (
              <DayColumn
                key={currentDate.toISOString()}
                date={currentDate}
                events={filteredEvents}
              />
            )}
          </div>
        )}
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onThemeChange={setTheme}
      />

      <OnlineStatus />
    </div>
  );
}

export default App;
