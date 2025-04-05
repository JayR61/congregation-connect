
// LocalStorage service to persist data between sessions

const STORAGE_KEYS = {
  PROJECTS: 'church-app-projects',
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
