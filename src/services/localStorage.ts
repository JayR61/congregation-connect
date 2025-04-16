
// LocalStorage service to persist data between sessions

const STORAGE_KEYS = {
  PROJECTS: 'church-app-projects',
  PROGRAMMES: 'church-app-programmes', 
  ATTENDANCE: 'church-app-attendance'
};

export const saveProjects = (projects: any[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch (error) {
    console.error('Error saving projects to localStorage:', error);
  }
};

export const getProjects = (): any[] => {
  try {
    const projectsString = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (projectsString) {
      return JSON.parse(projectsString);
    }
  } catch (error) {
    console.error('Error retrieving projects from localStorage:', error);
  }
  return [];
};

export const saveProgrammes = (programmes: any[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROGRAMMES, JSON.stringify(programmes));
  } catch (error) {
    console.error('Error saving programmes to localStorage:', error);
  }
};

export const getProgrammes = (): any[] => {
  try {
    const programmesString = localStorage.getItem(STORAGE_KEYS.PROGRAMMES);
    if (programmesString) {
      return JSON.parse(programmesString);
    }
  } catch (error) {
    console.error('Error retrieving programmes from localStorage:', error);
  }
  return [];
};

export const saveAttendance = (attendance: any[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  } catch (error) {
    console.error('Error saving attendance to localStorage:', error);
  }
};

export const getAttendance = (): any[] => {
  try {
    const attendanceString = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (attendanceString) {
      return JSON.parse(attendanceString);
    }
  } catch (error) {
    console.error('Error retrieving attendance from localStorage:', error);
  }
  return [];
};
