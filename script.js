const form = document.getElementById('form');
const submitBtn = form.querySelector('button[type="submit"]');
const toast = document.getElementById('toastNotification');
const toastIcon = document.getElementById('toastIcon');
const toastTitle = document.getElementById('toastTitle');
const toastMessage = document.getElementById('toastMessage');

let toastTimeout;

function showToast(type, title, message) {
  clearTimeout(toastTimeout);

  toast.className = `toast-card ${type}`;
  toastTitle.textContent = title;
  toastMessage.textContent = message;

  if (type === 'success') {
    toastIcon.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;
  } else {
    toastIcon.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;
  }

  toast.classList.add('show');

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  formData.append("access_key", "4fe7611e-1f16-4384-912f-0534ebf1d9e8");

  const originalContent = submitBtn.innerHTML;
  submitBtn.innerHTML = "<span>SENDING...</span>";
  submitBtn.disabled = true;

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (response.ok && data.success) {
      showToast("success", "Message Sent!", "Thank you! I will get back to you shortly.");
      form.reset();
    } else {
      showToast("error", "Submission Failed", data.message || "Something went wrong. Please try again.");
    }
  } catch (error) {
    showToast("error", "Network Error", "Unable to send right now. Please check your connection.");
  } finally {
    submitBtn.innerHTML = originalContent;
    submitBtn.disabled = false;
  }
});