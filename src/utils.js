
export const getPriority = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diffInTime = due - today;
  const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));

  if (diffInDays <= 2) return { label: 'High', color: 'red' };
  if (diffInDays <= 4) return { label: 'Medium', color: 'orange' };
  return { label: 'Low', color: 'goldenrod' };
};
