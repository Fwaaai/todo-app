# Prerequisites
Node.js 22
PostgreSQL 18

# Installation

```bash
git clone https://github.com/Fwaaai/todo-app/
cd todo-app
cd backend
npm install
cd ..
cd frontend
npm install
```

Please fill in /backend/.env with the following: 

DATABASE_URL="postgresql://[username]:[password]@localhost:[port]/[database name]?schema=public"

SECRET_KEY=[secret key for password hashing]

Then, you need to run these once.
```bash
cd backend
npx prisma generate
npx prisma migrate dev
```


# Use
ESModules syntax is used.
CommonJS syntax is NOT USED. If you switch type to CommonJS in config, this project WILL BREAK.

By default, backend runs at port 8000 and frontend at port 3000.
Make sure your DB is running when you run the backend.

Both backend and frontend are run using `npm run dev`.
Run them separately:
```bash
cd frontend
npm run dev
```

```bash
cd backend
npm run dev
```

# Description

This is a training project for me. Feel free to use it around, play around with it, or use it for courses (idk, maybe you'd want that). Remember that I did not use the most secure methods around (although they are more secure than a lot of the old websites) -- bcrypt and JWT are mainly used for password hashing and auth. 

# Stack
I used the following stack in my project:
Frontend: 
  Next.js and React
  Tailwind CSS
  TypeScript
Backend:
  Express.js and Node.js
ORM:
  Prisma
DB:
  PostgreSQL

  


