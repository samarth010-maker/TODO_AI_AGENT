# 🤖 AI To-Do Agent (CLI + PostgreSQL + Drizzle)

An intelligent **AI-powered To-Do assistant** that understands natural language and manages tasks using a database-backed system.

---

## 🚀 Features

* 🧠 Natural language task creation (AI-powered)
* 📋 View all tasks
* 🔍 Search tasks
* ❌ Delete tasks
* 🗄️ Persistent storage using PostgreSQL
* ⚡ Fast ORM with Drizzle
* 💻 CLI-based interaction

---

## 🧱 Tech Stack

* **Backend:** Node.js (ES Modules)
* **Database:** PostgreSQL (Dockerized)
* **ORM:** Drizzle ORM
* **AI:** OpenAI / Ollama (optional)
* **CLI Input:** readline-sync

---

## 🏗️ Architecture

User Input → AI Agent → Tool Execution → Database → Response

---

## 🐳 Setup (Docker + DB)

### 1. Start PostgreSQL using Docker

```bash
docker compose up -d
```

---

### 2. Setup Environment Variables

Create a `.env` file:

```env
DATABASE_URL=postgres://admin:admin@localhost:5431/postgres
OPENAI_API_KEY=your_api_key_here
```

---

### 3. Install Dependencies

```bash
npm install
```

---

### 4. Run Migrations

```bash
npx drizzle-kit generate
npx drizzle-kit push
```

---

## ▶️ Run the Project

```bash
node index.js
```

---

## 💡 Example Usage

```
>> Add a task to buy groceries
🤖: Your todo has been added successfully

>> Show all tasks
🤖: [ { id: 1, todo: "Buy groceries" } ]
```

---

## 🧠 How It Works

The AI agent follows a structured loop:

1. **PLAN** → Understand user intent
2. **ACTION** → Call appropriate tool
3. **OBSERVATION** → Get DB result
4. **OUTPUT** → Respond to user

---

## 🛠️ Available Tools

* `getAllTodos()` → Fetch all tasks
* `createTodo(todo)` → Add new task
* `searchTodo(query)` → Search tasks
* `deleteTodoById(id)` → Delete task

---

## 🔐 Security Note

* `.env` is ignored via `.gitignore`
* API keys are NOT stored in the repository

---

## 🚀 Future Improvements

* 🌐 Web UI (React)
* 📅 Due dates & reminders
* ✅ Mark tasks as completed
* 🔔 Notifications
* 🧠 Better AI reasoning

---

## 👨‍💻 Author

**Samarth Awasthi**

---

## ⭐ If you like this project

Give it a star ⭐ on GitHub!
