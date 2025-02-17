function initPopup() {
    // Consent-Popup
    const consentPopup = document.getElementById('consent-popup');
    const consentAccept = document.getElementById('consent-accept');
    const consentMore = document.getElementById('consent-more');
    const consentDetails = document.getElementById('consent-details');
  
    if (consentPopup && !localStorage.getItem('consentGiven')) {
      consentPopup.style.display = 'flex';
    }
  
    if (consentAccept) {
      consentAccept.addEventListener('click', function() {
        localStorage.setItem('consentGiven', 'true');
        if (consentPopup) consentPopup.style.display = 'none';
      });
    }
  
    if (consentMore && consentDetails) {
      consentMore.addEventListener('click', function() {
        consentDetails.style.display = (consentDetails.style.display === 'none' || consentDetails.style.display === '') ? 'block' : 'none';
      });
    }
  
    // Hilfe-Popup
    const helpIcon = document.getElementById('help-icon');
    const helpPopup = document.getElementById('help-popup');
    const helpClose = document.getElementById('help-close');
  
    if (helpIcon && helpPopup) {
      helpIcon.addEventListener('click', function() {
        helpPopup.style.display = 'flex';
      });
    }
  
    if (helpClose && helpPopup) {
      helpClose.addEventListener('click', function() {
        helpPopup.style.display = 'none';
      });
    }
  }
  