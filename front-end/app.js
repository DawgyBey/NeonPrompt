const submitBtn = document.getElementById('submitBtn');
const userInput = document.getElementById('userInput');
const outputBox = document.getElementById('output');
const historyList = document.getElementById('historyList');
const clearBtn = document.getElementById('clearHistoryBtn');
const API_URL = 'https://neonprompt-backend.onrender.com/api/enhance';
// load saved history
window.addEventListener('DOMContentLoaded', () => {
  const saved = JSON.parse(localStorage.getItem('promptHistory')) || [];
  saved.forEach(({ input, output }) => addToHistory(input, output));
});

// on Enhance click
submitBtn.addEventListener('click', async () => {
  const prompt = userInput.value.trim();
  if (!prompt) return;
  outputBox.innerHTML = `<p class="placeholder">Enhancing...</p>`;

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    if (data.enhanced) {
      outputBox.innerHTML = `<p>${data.enhanced}</p>`;
      addToHistory(prompt, data.enhanced);
    } else {
      outputBox.innerHTML = `<p class="placeholder">Something went wrong.</p>`;
    }
  } catch {
    outputBox.innerHTML = `<p class="placeholder">Error enhancing prompt.</p>`;
  }
});

// history helper
function addToHistory(input, output) {
  const li = document.createElement('li');
  li.textContent = `"${input}" ➜ "${output}"`;
  li.onclick = () => userInput.value = input;
  historyList.prepend(li);

  const cur = JSON.parse(localStorage.getItem('promptHistory')) || [];
  cur.unshift({ input, output });
  if (cur.length>20) cur.pop();
  localStorage.setItem('promptHistory', JSON.stringify(cur));
}

// clear history
clearBtn.addEventListener('click', () => {
  historyList.innerHTML = '';
  localStorage.removeItem('promptHistory');
});
