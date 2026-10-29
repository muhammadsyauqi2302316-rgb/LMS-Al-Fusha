import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthScreen } from './components/AuthScreen';
import { Navbar, ActiveTab } from './components/Navbar';
import { CourseList } from './components/CourseList';
import { LessonView } from './components/LessonView';
import { AiTutorView } from './components/AiTutorView';
import { MuhadatsahView } from './components/MuhadatsahView';
import { MufradatView } from './components/MufradatView';
import { ProgressView } from './components/ProgressView';
import { AdminPanel } from './components/AdminPanel';
import { Course, Lesson, LessonProgress } from './types/lms';
import { getCourses, subscribeToUserProgress, getUserProgressList } from './services/lmsService';
import { RefreshCw } from 'lucide-react';

function AppContent() {
  const { userProfile, isLoading, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseLesson, setSelectedCourseLesson] = useState<{
    course: Course;
    lesson: Lesson;
  } | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, LessonProgress>>({});

  // Load courses
  useEffect(() => {
    setCourses(getCourses());
  }, []);

  // Listen to Firestore user progress
  useEffect(() => {
    if (userProfile?.id) {
      // First fetch
      getUserProgressList(userProfile.id)
        .then((data) => setProgressMap(data || {}))
        .catch((err) => console.error('Failed to get initial progress:', err));

      // Subscribe to changes
      try {
        const unsubscribe = subscribeToUserProgress(userProfile.id, (newMap) => {
          setProgressMap(newMap);
        });
        return () => unsubscribe();
      } catch (err) {
        console.warn('Could not establish progress realtime listener:', err);
      }
    }
  }, [userProfile?.id]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-900 flex items-center justify-center font-bold text-3xl font-arabic shadow-xl shadow-emerald-500/20 mb-4 animate-pulse">
          ف
        </div>
        <p className="text-emerald-400 font-arabic text-xl font-bold mb-2">
          مَرْكَزُ الْفُصْحَى لِتَعَلُّمِ اللُّغَةِ الْعَرَبِيَّةِ
        </p>
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" />
          <span>Memuat sistem Al-Fusha LMS...</span>
        </div>
      </div>
    );
  }

  // Wajib Login Guard: If not logged in, display full login screen
  if (!userProfile) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Navbar with Logout button */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedCourseLesson(null);
          setActiveTab(tab);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {selectedCourseLesson ? (
          <LessonView
            course={selectedCourseLesson.course}
            lesson={selectedCourseLesson.lesson}
            onBack={() => setSelectedCourseLesson(null)}
            onLessonCompleted={(lessonId, score) => {
              setProgressMap((prev) => ({
                ...prev,
                [lessonId]: {
                  userId: userProfile.id,
                  lessonId,
                  courseId: selectedCourseLesson.course.id,
                  completed: true,
                  quizScore: score,
                  updatedAt: new Date().toISOString()
                }
              }));
            }}
          />
        ) : (
          <>
            {activeTab === 'courses' && (
              <CourseList
                courses={courses}
                progressMap={progressMap}
                onSelectLesson={(course, lesson) => {
                  setSelectedCourseLesson({ course, lesson });
                }}
              />
            )}

            {activeTab === 'ai-tutor' && <AiTutorView />}

            {activeTab === 'muhadatsah' && <MuhadatsahView />}

            {activeTab === 'mufradat' && <MufradatView />}

            {activeTab === 'progress' && (
              <ProgressView courses={courses} progressMap={progressMap} />
            )}

            {activeTab === 'admin' && isAdmin && (
              <AdminPanel
                courses={courses}
                onCourseAdded={(newCourses) => setCourses(newCourses)}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Al-Fusha LMS</span>
            <span>•</span>
            <span className="font-arabic text-emerald-800">تَعَلَّمِ الْعَرَبِيَّةَ بِسُهُولَةٍ</span>
          </div>
          <p>© 2026 Al-Fusha LMS. React + Vite + Firebase Firestore + Gemini AI.</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
