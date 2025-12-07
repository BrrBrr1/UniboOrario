import React, { useState, useEffect, useCallback } from 'react';
import { addDays, startOfWeek, addWeeks, subWeeks, format, isSameDay, isSameWeek } from 'date-fns';
import Header from './components/Header';
import WeekNavigator from './components/WeekNavigator';
import DayColumn from './components/DayColumn';
import CourseFilter from './components/CourseFilter';
import ViewToggle from './components/ViewToggle';
import DayTabs from './components/DayTabs';
import YearSelector from './components/YearSelector';
import CourseSelector from './components/CourseSelector';
import LoadingSkeleton from './components/LoadingSkeleton';
import LessonFilter from './components/LessonFilter';
import { fetchTimetable } from './services/api';
import SettingsModal from './components/SettingsModal';
import useLocalStorage from './hooks/useLocalStorage';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import NotificationContainer from './components/NotificationContainer';
import useNetworkStatus from './hooks/useNetworkStatus';
import usePWAUpdate from './hooks/usePWAUpdate';
import useSwipe from './hooks/useSwipe';
import { RotateCcw, Calendar } from 'lucide-react';
import { courses } from './data/courses';
import './index.css';

const DEFAULT_COURSE = courses[0];

function AppContent() {
  const { addNotification } = useNotification();
  const [events, setEvents] = useState([]);
  const [availableLessons, setAvailableLessons] = useState([]);

  const [selectedCourse, setSelectedCourse] = useLocalStorage('preference_course', DEFAULT_COURSE);
  const [year, setYear] = useLocalStorage('preference_year', 1);
  const [customCourses, setCustomCourses] = useLocalStorage('preference_custom_courses', []);
  const [hiddenCourseIds, setHiddenCourseIds] = useLocalStorage('preference_hidden_courses', []);

  const [courseOrder, setCourseOrder] = useLocalStorage('preference_course_order', []);

  const getSelectedLessonsKey = (courseId, yearVal) => `preference_selectedLessons_${courseId}_year_${yearVal}`;

  const [selectedLessons, setSelectedLessons] = useState(null);

  useEffect(() => {
    const key = getSelectedLessonsKey(selectedCourse.id, year);
    const saved = localStorage.getItem(key);
    if (saved) {
      setSelectedLessons(JSON.parse(saved));
    } else {
      setSelectedLessons(null);
    }
  }, [selectedCourse.id, year]);

  useEffect(() => {
    if (selectedLessons !== null) {
      const key = getSelectedLessonsKey(selectedCourse.id, year);
      localStorage.setItem(key, JSON.stringify(selectedLessons));
    }
  }, [selectedLessons, selectedCourse.id, year]);

  const [currentDate, setCurrentDate] = useState(() => {
    const savedDate = sessionStorage.getItem('currentDate');
    return savedDate ? new Date(savedDate) : new Date();
  });

  useEffect(() => {
    sessionStorage.setItem('currentDate', currentDate.toISOString());
  }, [currentDate]);
  const [filter, setFilter] = useLocalStorage('preference_filter', '');

  const [filterType, setFilterType] = useLocalStorage('preference_filterType', 'title');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useLocalStorage('preference_viewMode', 'week');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [compactView, setCompactView] = useLocalStorage('preference_compactView', false);
  const [use24Hour, setUse24Hour] = useLocalStorage('preference_use24Hour', true);
  const [showWeekends, setShowWeekends] = useLocalStorage('preference_showWeekends', true);
  const [notificationsEnabled, setNotificationsEnabled] = useLocalStorage('preference_notifications', true);
  const [autoRefresh, setAutoRefresh] = useLocalStorage('preference_autoRefresh', false);

  useNetworkStatus();
  usePWAUpdate();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const PULL_THRESHOLD = 80;

  const isCurrentWeek = isSameWeek(currentDate, new Date(), { weekStartsOn: 1 });
  const isToday = isSameDay(currentDate, new Date());

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleCourseChange = (newCourse) => {
    setSelectedCourse(newCourse);
    setYear(1);
    setSelectedLessons(null);
    setAvailableLessons([]);
    setLoading(true);
  };

  const handleYearChange = (newYear) => {
    setYear(newYear);
    setSelectedLessons(null);
    setAvailableLessons([]);
    setLoading(true);
  };

  const validateCustomCourse = async (courseData) => {
    try {
      const testUrl = `${courseData.url}?anno=1&curricula=${courseData.curricula || ''}`;
      const data = await fetchTimetable(testUrl);
      return data && Array.isArray(data);
    } catch (e) {
      return false;
    }
  };

  const handleAddCustomCourse = async (courseData) => {
    setLoading(true);
    const isValid = await validateCustomCourse(courseData);
    setLoading(false);

    if (isValid) {
      setCustomCourses(prev => [...prev, { ...courseData, id: `custom-${Date.now()}` }]);
      addNotification('success', 'Corso aggiunto con successo');
      return true;
    } else {
      addNotification('error', 'URL o Curricula non validi. Impossibile recuperare i dati.');
      return false;
    }
  };

  const handleRemoveCustomCourse = (courseId) => {
    setCustomCourses(prev => prev.filter(c => c.id !== courseId));
    if (selectedCourse.id === courseId) {
      setSelectedCourse(DEFAULT_COURSE);
      setYear(1);
    }
    addNotification('info', 'Corso rimosso');
  };

  const handleToggleCourseVisibility = (courseId) => {
    setHiddenCourseIds(prev => {
      if (prev.includes(courseId)) {
        return prev.filter(id => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });
  };

  useEffect(() => {
    const loadData = async () => {
      if (!selectedCourse?.url) return;

      setLoading(true);

      try {
        const start = startOfWeek(currentDate, { weekStartsOn: 1 });
        const end = addWeeks(start, 1);

        const startStr = format(start, 'yyyy-MM-dd');
        const endStr = format(end, 'yyyy-MM-dd');

        const curriculaParam = selectedCourse.curricula !== undefined ? selectedCourse.curricula : 'C60-000';
        const url = `${selectedCourse.url}?anno=${year}&curricula=${curriculaParam}&start=${startStr}&end=${endStr}`;

        console.log('Fetching URL:', url); // For debugging

        const data = await fetchTimetable(url);

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

        const key = getSelectedLessonsKey(selectedCourse.id, year);
        const saved = localStorage.getItem(key);

        if (!saved) {
          setSelectedLessons(uniqueLessons.map(l => l.cod_modulo));
        }

        setEvents(data);
      } catch (error) {
        console.error("Error loading timetable:", error);
        addNotification('error', 'URL Json o Codice Curricula errati');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentDate, year, selectedCourse]);

  useEffect(() => {
    if (!autoRefresh) return;

    const intervalId = setInterval(() => {
      console.log('Auto-refreshing timetable data...');
      setCurrentDate(prev => new Date(prev));
    }, 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [autoRefresh]);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: showWeekends ? 7 : 5 }, (_, i) => addDays(weekStart, i));

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleJumpToToday = () => {
    setCurrentDate(new Date());
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setCurrentDate(prev => new Date(prev));
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsRefreshing(false);
    setPullDistance(0);
  }, []);
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
      const weekEnd = addDays(weekStart, 6);
      weekEnd.setHours(23, 59, 59, 999);

      if (today >= weekStart && today <= weekEnd) {
        setCurrentDate(today);
      } else {
        setCurrentDate(weekStart);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      switch (e.key) {
        case 'ArrowLeft':
          setCurrentDate(prev => subWeeks(prev, 1));
          break;
        case 'ArrowRight':
          setCurrentDate(prev => addWeeks(prev, 1));
          break;
        case '1':
        case '2':
        case '3':
        case '5':
        case '6':
        case '7':
          if (viewMode === 'day') {
            const dayIndex = parseInt(e.key) - 1;

            if (dayIndex >= 5 && !showWeekends) return;

            const currentWeekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
            const newDate = addDays(currentWeekStart, dayIndex);
            setCurrentDate(newDate);
          }
          break;
        case 'w':
        case 'W':
          setViewMode('week');
          break;
        case 'd':
        case 'D':
          handleViewModeChange('day');
          break;
        case 's':
        case 'S':
          setIsSettingsOpen(true);
          break;
        case '/':
          e.preventDefault();
          const filterInput = document.querySelector('.filter-input');
          if (filterInput) filterInput.focus();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, currentDate, handleViewModeChange]);

  const filteredEvents = events.filter(event => {
    if (selectedLessons && !selectedLessons.includes(event.cod_modulo)) {
      return false;
    }
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

          <div className="selectors-row">
            <CourseSelector
              selectedCourse={selectedCourse}
              onCourseChange={handleCourseChange}
              customCourses={customCourses}
              hiddenCourseIds={hiddenCourseIds}
              onAddCustomCourse={handleAddCustomCourse}
              onRemoveCustomCourse={handleRemoveCustomCourse}
              onToggleCourseVisibility={handleToggleCourseVisibility}
              courseOrder={courseOrder}
              onOrderChange={setCourseOrder}
            />
            <YearSelector
              year={year}
              onYearChange={handleYearChange}
              maxYears={selectedCourse.years}
            />
          </div>

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
