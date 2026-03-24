export const now = () => new Date();

export const addMinutesFromNow = (minutes: number) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);
  return date;
};
