const WhatsAppCommunityLink = 'https://chat.whatsapp.com/FUo2MVMuvSKKsbJwoIldW3'

export const JoinCommunity = () => {
  setTimeout(() => {
    const newWindow = window.open(WhatsAppCommunityLink, '_blank');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      window.location.href = WhatsAppCommunityLink;
    }
  }, 0);
};