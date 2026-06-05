const EMAILJS_PUBLIC_KEY  = 'YAIp87CLP8Yjy5q1-'; 
const EMAILJS_SERVICE_ID  = 'service_jlzhwy8';  
const EMAILJS_TEMPLATE_ID = 'template_mv4xjjq';  

// Initialise EmailJS
(function () {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
})();


/* ══════════════════════════════════════════
   PRELOADER
══════════════════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
  }, 2000);
});


/* ══════════════════════════════════════════
   CARD 3D TILT
══════════════════════════════════════════ */
const cardWrapper = document.getElementById('cardWrapper');
const card3d      = document.getElementById('card3d');

if (cardWrapper && card3d) {
  cardWrapper.addEventListener('mousemove', (e) => {
    const rect = cardWrapper.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / (rect.width  / 2);
    const dy   = (e.clientY - cy) / (rect.height / 2);
    card3d.style.transform = `rotateY(${dx * 12}deg) rotateX(${-dy * 8}deg)`;
  });

  cardWrapper.addEventListener('mouseleave', () => {
    card3d.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });
}


/* ══════════════════════════════════════════
   STEP NAVIGATION
══════════════════════════════════════════ */
function goToStep(id) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('step-' + id);
  if (el) {
    el.classList.add('active');
    // Smooth scroll the form widget into view on mobile
    el.closest('.form-widget')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}
window.goToStep = goToStep;


/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setLoading(on) {
  const btn     = document.getElementById('join-btn');
  const label   = document.getElementById('join-btn-label');
  const spinner = document.getElementById('join-btn-spinner');
  btn.disabled        = on;
  label.style.display = on ? 'none'   : 'inline';
  spinner.style.display = on ? 'inline' : 'none';
}


/* ══════════════════════════════════════════
   WAITLIST SUBMIT
══════════════════════════════════════════ */
async function handleJoin() {
  const emailInput = document.getElementById('email-input');
  const email      = emailInput.value.trim();
  const errEl      = document.getElementById('email-error');
  errEl.textContent = '';

  if (!isValidEmail(email)) {
    errEl.textContent = 'Please enter a valid email address.';
    emailInput.focus();
    return;
  }

  setLoading(true);

  try {
    // Send notification to chantoexp@gmail.com
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email:   'chantoexp@gmail.com',
      from_email: email,
      reply_to:   email,
      message:    `New Lilac Card waitlist signup: ${email}`,
      join_time:  new Date().toLocaleString(),
    });

    // Show success step
    document.getElementById('success-subtitle').textContent =
      `We've saved your spot. We'll be in touch at ${email} when early access opens.`;
    goToStep('success');

  } catch (err) {
    console.error('EmailJS error:', err);
    errEl.textContent = 'Something went wrong — please try again.';
    setLoading(false);
  }
}

// Wire up button and Enter key
document.getElementById('join-btn').addEventListener('click', handleJoin);
document.getElementById('email-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleJoin();
});


/* ══════════════════════════════════════════
   SCROLL-TRIGGERED FADE-IN
══════════════════════════════════════════ */
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = (i % 3) * 80;
      entry.target.style.transition = `opacity 0.6s ${delay}ms ease, transform 0.6s ${delay}ms ease`;
      entry.target.style.opacity    = '1';
      entry.target.style.transform  = 'translateY(0)';
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.feature-card, .stack-card').forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(20px)';
  fadeObserver.observe(el);
});
