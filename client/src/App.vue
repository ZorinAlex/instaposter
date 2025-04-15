<template>
  <div class="app-container">
    <header>
      <h1>Instagram Post Scheduler</h1>
    </header>
    <main>
      <router-view />
    </main>
    <footer>
      <p>© {{ new Date().getFullYear() }} Instagram Post Scheduler</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f9f9f9;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  background-color: #405de6;
  color: white;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

footer {
  background-color: #f0f0f0;
  padding: 1rem;
  text-align: center;
  font-size: 0.9rem;
  color: #666;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
}

h1, h2, h3 {
  margin-bottom: 1rem;
}

button {
  cursor: pointer;
  padding: 0.5rem 1rem;
  background-color: #405de6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #304aa6;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-delete {
  background-color: #e53935;
}

.btn-delete:hover {
  background-color: #c62828;
}

.btn-edit {
  background-color: #4caf50;
}

.btn-edit:hover {
  background-color: #388e3c;
}
</style> 