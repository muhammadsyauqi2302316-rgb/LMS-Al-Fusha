import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile, LessonProgress, VocabItem, Course } from '../types/lms';
import { INITIAL_COURSES } from '../data/coursesData';

// Fetch or initialize user profile in Firestore
export async function getOrCreateUserProfile(
  uid: string,
  email: string,
  displayName: string,
  photoURL?: string,
  isRuntimeAdminEmail = false
): Promise<UserProfile> {
  const userDocRef = doc(db, 'users', uid);
  const path = `users/${uid}`;

  try {
    const snapshot = await getDoc(userDocRef);
    if (snapshot.exists()) {
      const data = snapshot.data() as UserProfile;
      // Auto-elevate if runtime admin email
      if (isRuntimeAdminEmail && data.role !== 'admin') {
        await updateDoc(userDocRef, { role: 'admin' });
        return { ...data, role: 'admin' };
      }
      return data;
    }

    // Create new profile
    const newProfile: UserProfile = {
      id: uid,
      email: email || '',
      displayName: displayName || (email ? email.split('@')[0] : 'Siswa Al-Fusha'),
      photoURL: photoURL || '',
      role: isRuntimeAdminEmail ? 'admin' : 'student',
      xp: 100, // Starter bonus
      streak: 1,
      level: 'Mubtadi\' (Pemula)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(userDocRef, newProfile);
    return newProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// Update XP and Streak
export async function addXPToUser(userId: string, xpGained: number): Promise<void> {
  const userDocRef = doc(db, 'users', userId);
  const path = `users/${userId}`;

  try {
    const snapshot = await getDoc(userDocRef);
    if (snapshot.exists()) {
      const current = snapshot.data() as UserProfile;
      const newXp = (current.xp || 0) + xpGained;
      let newLevel = current.level || 'Mubtadi\' (Pemula)';
      if (newXp >= 1000) newLevel = 'Mutaqaddim (Lanjut)';
      else if (newXp >= 400) newLevel = 'Mutawassith (Menengah)';

      await updateDoc(userDocRef, {
        xp: newXp,
        level: newLevel,
        updatedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Save or update lesson progress
export async function saveLessonProgressToFirestore(
  userId: string,
  progress: LessonProgress
): Promise<void> {
  const docPath = `users/${userId}/progress/${progress.lessonId}`;
  const progressDocRef = doc(db, 'users', userId, 'progress', progress.lessonId);

  try {
    await setDoc(progressDocRef, {
      ...progress,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

// Fetch all progress for a user
export async function getUserProgressList(userId: string): Promise<Record<string, LessonProgress>> {
  const collectionPath = `users/${userId}/progress`;
  const progressCollection = collection(db, 'users', userId, 'progress');

  try {
    const snapshot = await getDocs(progressCollection);
    const result: Record<string, LessonProgress> = {};
    snapshot.forEach(docSnap => {
      const data = docSnap.data() as LessonProgress;
      result[data.lessonId] = data;
    });
    return result;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionPath);
  }
}

// Subscribe to user progress real-time
export function subscribeToUserProgress(
  userId: string,
  onUpdate: (progressMap: Record<string, LessonProgress>) => void
) {
  const collectionPath = `users/${userId}/progress`;
  const progressCollection = collection(db, 'users', userId, 'progress');

  return onSnapshot(
    progressCollection,
    snapshot => {
      const result: Record<string, LessonProgress> = {};
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as LessonProgress;
        result[data.lessonId] = data;
      });
      onUpdate(result);
    },
    error => {
      handleFirestoreError(error, OperationType.LIST, collectionPath);
    }
  );
}

// Saved Vocabulary per user
export async function saveVocabToFirestore(userId: string, item: VocabItem): Promise<void> {
  const path = `users/${userId}/vocabulary/${item.id}`;
  const vocabRef = doc(db, 'users', userId, 'vocabulary', item.id);

  try {
    await setDoc(vocabRef, {
      ...item,
      userId,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getUserSavedVocabulary(userId: string): Promise<VocabItem[]> {
  const path = `users/${userId}/vocabulary`;
  const vocabCollection = collection(db, 'users', userId, 'vocabulary');

  try {
    const snapshot = await getDocs(vocabCollection);
    const list: VocabItem[] = [];
    snapshot.forEach(docSnap => {
      list.push(docSnap.data() as VocabItem);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function getAllUsersForAdmin(): Promise<UserProfile[]> {
  const path = 'users';
  try {
    const snapshot = await getDocs(collection(db, 'users'));
    const users: UserProfile[] = [];
    snapshot.forEach(docSnap => {
      users.push(docSnap.data() as UserProfile);
    });
    return users;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// Local + Custom Courses persistence
const LOCAL_COURSES_KEY = 'al_fusha_custom_courses';

export function getCourses(): Course[] {
  try {
    const stored = localStorage.getItem(LOCAL_COURSES_KEY);
    if (stored) {
      const customCourses = JSON.parse(stored) as Course[];
      return [...INITIAL_COURSES, ...customCourses];
    }
  } catch {
    // fallback
  }
  return INITIAL_COURSES;
}

export function saveCustomCourse(course: Course): Course[] {
  try {
    const stored = localStorage.getItem(LOCAL_COURSES_KEY);
    const customCourses: Course[] = stored ? JSON.parse(stored) : [];
    customCourses.unshift(course);
    localStorage.setItem(LOCAL_COURSES_KEY, JSON.stringify(customCourses));
    return [...INITIAL_COURSES, ...customCourses];
  } catch {
    return [...INITIAL_COURSES, course];
  }
}
