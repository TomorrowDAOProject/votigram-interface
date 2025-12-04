

export const getTrackId = () => {
  if (window?.Telegram) {
    const startParam = window.Telegram.WebApp.initDataUnsafe.start_param;
    const taskDivider = '__CPN__';
    if (startParam && startParam.includes(taskDivider)) {
      const param = startParam.split(taskDivider)[1];
      return param;
    } else {
      return '';
    }
  }
};
