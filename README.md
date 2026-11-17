# EquipRent: Equipment Rental System (frontend)

Frontend for Project 2 (Equipment Rental System), course 2110507. Built with Next.js, NextAuth and Tailwind CSS. It talks to the PJ02-EquipmentRent backend API.

## Run locally

1. Start the backend API (PJ02-EquipmentRent) and note its port.
2. Create `.env.local` in this folder with these three settings:

   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=<a long random string>
   BACKEND_URL=http://127.0.0.1:<backend port>
   ```

3. Install and start:

   ```bash
   npm install
   npm run dev
   ```

4. Open http://localhost:3000

`.env.local` is ignored by git and must never be committed.
