const LinkedInURL = 'https://www.linkedin.com/company/cofounds/'

export const GoToLinkedIn = () => {
  setTimeout(() => {
    const newWindow = window.open(LinkedInURL, '_blank');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      window.location.href = LinkedInURL;
    }
  }, 0);
};