const NotionDocLink = 'https://harmaj.notion.site/All-Openings-1c834016625380dbb0f1f5850f26f8b5?pvs=4'

export const OpenPositions = () => {
  setTimeout(() => {
    const newWindow = window.open(NotionDocLink, '_blank');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      window.location.href = NotionDocLink;
    }
  }, 0);
};