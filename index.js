// tools
import { db } from './db/index.js'
import { todosTable } from './db/schema.js'
import { eq, ilike } from 'drizzle-orm'
import readLineSync from 'readline-sync'
import Groq from "groq-sdk";

async function getAllTodos() {
    const todos = await db.select().from(todosTable);
    return todos;
}

async function createTodo(todo) {
    const [result] = await db.insert(todosTable).values({ todo }).returning({ id: todosTable.id });
    return result.id;
}

async function searchTodo(search) {
    const todos = await db.select().from(todosTable).where(ilike(todosTable.todo, `%${search}%`));
    return todos;
}

async function deleteTodoByID(id) {
    await db.delete(todosTable).where(eq(todosTable.id, parseInt(id)));
}

const tools = {
    getAllTodos,
    createTodo,
    searchTodo,
    deleteTodoByID,
}

const SYSTEM_PROMPT = `
You are an AI To-Do List assistant with START, PLAN, ACTION, Observation and Output state.
Wait for the user prompt and first PLAN using available tools.
After Planning, take the action with appropriate tools and wait for the observation based on action.
Once you get the observation, Return the AI response based on START prompt and observation.
You must strictly follow the JSON output format.

Todo DB Schema:
id: Int and Primary key
todo: String
created_at: Date Time
updated_at: Date Time

Available Tools:
- getAllTodos: Returns all Todos from Database
- createTodo(todo: String): Creates a new Todo in the DB, returns the ID
- searchTodo(query: String): Searches for todos matching query using ilike
- deleteTodoByID(id: String): Deletes the todo by ID

Example:
START
{"type": "user","user": "Add a task for Shopping groceries"}
{"type": "plan","plan": "I will ask the user for more details"}
{"type": "output","output": "Can you tell me what items you want to shop for?"}
{"type": "user","user": "milk, kurkure, momos and chocolate"}
{"type": "plan","plan": "I will use createTodo to create a new Todo in DB"}
{"type": "action","function": "createTodo","input": "Shopping for milk, kurkure, momos and chocolate"}
{"type": "observation","observation": "2"}
{"type": "output","output": "Your todo has been added successfully"}
`;

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const messages = [{ role: 'system', content: SYSTEM_PROMPT }];

while (true) {
    const query = readLineSync.question('>> ');
    const userMessage = { type: 'user', user: query };
    messages.push({ role: 'user', content: JSON.stringify(userMessage) });

    while (true) {
        const chat = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: messages,
            response_format: { type: "json_object" },
        });

        const result = chat.choices[0].message.content;
        messages.push({ role: 'assistant', content: result });

        const action = JSON.parse(result);

        console.log(`\n🧠 AI: ${JSON.stringify(action)}\n`);  // helpful for debugging

        if (action.type === 'output') {
            console.log(`🤖: ${action.output}`);
            break;
        } else if (action.type === 'action') {
            const fn = tools[action.function];
            if (!fn) throw new Error(`Invalid Tool Call: ${action.function}`);
            const observation = await fn(action.input);
            const observationMessage = { type: 'observation', observation: observation };
            messages.push({ role: 'user', content: JSON.stringify(observationMessage) });
        }
    }
}