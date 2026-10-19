emailjs.init(EMAILJS_PUBLIC_KEY);

let sentAlertsCache = new Set();

function sendThresholdAlert(districtName, weekLabel, currentPercent, thresholdPercent, techNames) {
  if (!S.alertEmails || S.alertEmails.trim() === '') return;

  const alertKey = `${districtName}_${weekLabel}_${Math.round(currentPercent * 100)}`;
  if (sentAlertsCache.has(alertKey)) return;

  const triggerUser = currentUser ? currentUser.u : 'Sistema';

  const templateParams = {
    to_emails: S.alertEmails,
    office: `Distrito: ${districtName} (Global)`,
    week: weekLabel,
    percent: Math.round(currentPercent * 100) + '%',
    threshold: thresholdPercent + '%',
    technicians: techNames.join(', '),
    user_action: triggerUser
  };

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then(function() {
       logAction(`Alerta enviada por mail a (${S.alertEmails}) por ausentismo GLOBAL del ${Math.round(currentPercent * 100)}% en ${districtName} (Acción por: ${triggerUser})`);
       sentAlertsCache.add(alertKey);
    }, function(error) {
       console.error('❌ Error EmailJS:', error);
    });
}