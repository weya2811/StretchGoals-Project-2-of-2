// Event templates shared by the Calendar page and the dashboard,
// so each class type has the same colours everywhere.
export const CLASS_TEMPLATES = [
    { title: 'Private Lesson', bg: '#fbcfe8', border: '#f43f5e' },
    { title: 'Corporate Yoga', bg: '#bbf7d0', border: '#16a34a' },
    { title: 'Yoga Therapy', bg: '#bae6fd', border: '#0284c7' },
    { title: 'Personal Time', bg: '#fef08a', border: '#ca8a04' },
    { title: 'Yoga Class', bg: '#e9d5ff', border: '#9333ea' }
];

const TEMPLATE_MAP = Object.fromEntries(
    CLASS_TEMPLATES.map((tpl) => [tpl.title, tpl])
);

// Colours aren't saved in the database, so look them up by the event title
export function getTemplateColours(title) {
    return TEMPLATE_MAP[title] || { bg: '#ffffff', border: '#cccccc' };
}
