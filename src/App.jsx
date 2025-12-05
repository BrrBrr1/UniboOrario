import React, { useState, useEffect, useCallback } from 'react';
import { addDays, startOfWeek, addWeeks, subWeeks, format, isSameDay, isSameWeek } from 'date-fns';
import Header from './components/Header';
import WeekNavigator from './components/WeekNavigator';
import DayColumn from './components/DayColumn';
import CourseFilter from './components/CourseFilter';
import ViewToggle from './components/ViewToggle';
import DayTabs from './components/DayTabs';
import YearSelector from './components/YearSelector';
import LoadingSkeleton from './components/LoadingSkeleton';
import LessonFilter from './components/LessonFilter';
import { fetchTimetable } from './services/api';
import SettingsModal from './components/SettingsModal';
import useLocalStorage from './hooks/useLocalStorage';
import { NotificationProvider } from './context/NotificationContext';
import NotificationContainer from './components/NotificationContainer';
import useNetworkStatus from './hooks/useNetworkStatus';
import usePWAUpdate from './hooks/usePWAUpdate';
import useSwipe from './hooks/useSwipe';
import { RotateCcw, Calendar } from 'lucide-react';
import './index.css';

// Base URL and params from user request
const BASE_URL = 'https://corsi.unibo.it/laurea/LingueTecnologieComunicazioneInterculturale/orario-lezioni/@@orario_reale_json';
// STATIC_PARAMS removed, will be constructed dynamically

function AppContent() {
  const [events, setEvents] = useState([]);
  const [availableLessons, setAvailableLessons] = useState([]);

  // Use localStorage for preferences
  const [year, setYear] = useLocalStorage('preference_year', 1);

  // Separate storage for each year
  const [selectedLessonsYear1, setSelectedLessonsYear1] = useLocalStorage('preference_selectedLessons_year_1', null);
  const [selectedLessonsYear2, setSelectedLessonsYear2] = useLocalStorage('preference_selectedLessons_year_2', null);
  const [selectedLessonsYear3, setSelectedLessonsYear3] = useLocalStorage('preference_selectedLessons_year_3', null);

  // Dynamic selection based on current year
  let selectedLessons, setSelectedLessons;
  if (year === 1) {
    selectedLessons = selectedLessonsYear1;
    setSelectedLessons = setSelectedLessonsYear1;
  } else if (year === 2) {
    selectedLessons = selectedLessonsYear2;
    setSelectedLessons = setSelectedLessonsYear2;
  } else {
    selectedLessons = selectedLessonsYear3;
    setSelectedLessons = setSelectedLessonsYear3;
  }
  const [currentDate, setCurrentDate] = useState(() => {
    const savedDate = sessionStorage.getItem('currentDate');
    return savedDate ? new Date(savedDate) : new Date();
  });

  // Persist currentDate to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('currentDate', currentDate.toISOString());
  }, [currentDate]);
  const [filter, setFilter] = useLocalStorage('preference_filter', '');
  // year state moved up
  const [filterType, setFilterType] = useLocalStorage('preference_filterType', 'title'); // 'title', 'teacher', 'location'
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useLocalStorage('preference_viewMode', 'week'); // 'week' or 'day'
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Additional settings
  const [compactView, setCompactView] = useLocalStorage('preference_compactView', false);
  const [use24Hour, setUse24Hour] = useLocalStorage('preference_use24Hour', true);
  const [showWeekends, setShowWeekends] = useLocalStorage('preference_showWeekends', false);
  const [notificationsEnabled, setNotificationsEnabled] = useLocalStorage('preference_notifications', true);
  const [autoRefresh, setAutoRefresh] = useLocalStorage('preference_autoRefresh', false);

  // Initialize hooks for notifications
  useNetworkStatus();
  usePWAUpdate();

  // Pull-to-refresh state
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const PULL_THRESHOLD = 80;

  // Check if viewing current week
  const isCurrentWeek = isSameWeek(currentDate, new Date(), { weekStartsOn: 1 });
  const isToday = isSameDay(currentDate, new Date());

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

      const url = `${BASE_URL}?anno=${year}&curricula=C60-000&start=${startStr}&end=${endStr}`;

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

      // If no lessons are selected yet (first visit), select all by default
      if (selectedLessons === null) {
        setSelectedLessons(uniqueLessons.map(l => l.cod_modulo));
      }

      setEvents(data);
      setLoading(false);
    };
    loadData();
  }, [currentDate, year]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const intervalId = setInterval(() => {
      console.log('Auto-refreshing timetable data...');
      setCurrentDate(prev => new Date(prev)); // Trigger reload by updating the date object
    }, 60 * 60 * 1000); // Refresh every hour

    return () => clearInterval(intervalId);
  }, [autoRefresh]);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  // Show weekends if enabled, otherwise Mon-Fri only
  const weekDays = Array.from({ length: showWeekends ? 7 : 5 }, (_, i) => addDays(weekStart, i));

  // Navigation handlers
  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
  };

  // Jump to today
  const handleJumpToToday = () => {
    setCurrentDate(new Date());
  };

  // Pull-to-refresh handlers
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Trigger reload by updating the date object
    setCurrentDate(prev => new Date(prev));
    // Add a minimum delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsRefreshing(false);
    setPullDistance(0);
  }, []);

  // Swipe handlers for week navigation
  const handleSwipeLeft = useCallback(() => {
    if (viewMode === 'week') {
      setCurrentDate(prev => addWeeks(prev, 1));
    }
  }, [viewMode]);

  const handleSwipeRight = useCallback(() => {
    if (viewMode === 'week') {
      setCurrentDate(prev => subWeeks(prev, 1));
    }
  }, [viewMode]);

  const swipeHandlers = useSwipe(handleSwipeLeft, handleSwipeRight);

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
        case '5':
        case '6':
        case '7':
          // Jump to specific day (Mon-Fri, or Mon-Sun if weekends enabled)
          if (viewMode === 'day') {
            const dayIndex = parseInt(e.key) - 1;

            // Only allow navigation to weekends if enabled
            if (dayIndex >= 5 && !showWeekends) return;

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
    if (selectedLessons && !selectedLessons.includes(event.cod_modulo)) {
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
      <NotificationContainer />

      <main className="main-content">
        <div className="controls-section">
          <div className="top-controls">
            <WeekNavigator currentDate={currentDate} onDateChange={handleDateChange} />
            <ViewToggle viewMode={viewMode} onViewChange={handleViewModeChange} />
          </div>

          <YearSelector year={year} onYearChange={setYear} />

          <LessonFilter
            lessons={availableLessons}
            selectedLessons={selectedLessons || []}
            onSelectionChange={setSelectedLessons}
            loading={loading}
          />

          <CourseFilter
            filter={filter}
            onFilterChange={setFilter}
            filterType={filterType}
            onFilterTypeChange={setFilterType}
          />
          {viewMode === 'day' && (
            <DayTabs
              currentDate={currentDate}
              onDateChange={handleDateChange}
              showWeekends={showWeekends}
            />
          )}
        </div>

        {loading ? (
          <LoadingSkeleton viewMode={viewMode} />
        ) : (
          <div
            className={`timetable-grid ${viewMode}`}
            {...swipeHandlers}
          >
            {viewMode === 'week' ? (
              weekDays.map(day => (
                <DayColumn
                  key={day.toISOString()}
                  date={day}
                  events={filteredEvents}
                  compactView={compactView}
                  use24Hour={use24Hour}
                />
              ))
            ) : (
              <DayColumn
                key={currentDate.toISOString()}
                date={currentDate}
                events={filteredEvents}
                compactView={compactView}
                use24Hour={use24Hour}
              />
            )}
          </div>
        )}

        {/* Floating Today Button */}
        {((viewMode === 'week' && !isCurrentWeek) || (viewMode === 'day' && !isToday)) && (
          <button
            className="fab-today"
            onClick={handleJumpToToday}
            aria-label="Torna a oggi"
          >
            <Calendar size={20} />
            <span>Oggi</span>
          </button>
        )}
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onThemeChange={setTheme}
        compactView={compactView}
        onCompactViewChange={setCompactView}
        use24Hour={use24Hour}
        onUse24HourChange={setUse24Hour}
        showWeekends={showWeekends}
        onShowWeekendsChange={setShowWeekends}
        notificationsEnabled={notificationsEnabled}
        onNotificationsChange={setNotificationsEnabled}
        autoRefresh={autoRefresh}
        onAutoRefreshChange={setAutoRefresh}
      />
    </div>
  );
}

function App() {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
}

export default App;
