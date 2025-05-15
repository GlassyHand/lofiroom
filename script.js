// To-Do List Logic
document.getElementById('add-todo').addEventListener('click', () => {
  const input = document.getElementById('todo-input');
  const text = input.value.trim();
  if (text) {
    const li = document.createElement('li');
    li.textContent = text;
    li.addEventListener('click', () => li.remove());
    document.getElementById('todo-list').appendChild(li);
    input.value = '';
  }
});

// Dress-Up Logic
function changeOutfit(filename) {
  const character = document.getElementById('character');
  character.src = `assets/outfits/${filename}`;
}

// Background Change Logic
function changeBackground(filename) {
  document.body.style.backgroundImage = `url('assets/images/${filename}')`;
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundPosition = 'center';
}
