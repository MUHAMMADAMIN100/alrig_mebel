export function extractInstagramUsername(url: string): string {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === 'www.instagram.com') {
        const pathname = urlObj.pathname;
        const username = pathname.split('/')[1];
        if (username) {
          return `${username}`;
        }
      }
      return 'Неверный формат URL';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return 'Ошибка при обработке URL';
    }
  }
  