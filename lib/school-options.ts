export const COURSE_OPTIONS = ['IT', 'HRMT', 'ECT', 'HST'] as const;
export const YEAR_LEVEL_OPTIONS = ['1st Year', '2nd Year', '3rd Year'] as const;

export type CourseOption = (typeof COURSE_OPTIONS)[number];
export type YearLevelOption = (typeof YEAR_LEVEL_OPTIONS)[number];
