<p align="center">
<img src='https://media.tenor.com/-eVltmHz5ysAAAAM/cooking-pot-stir.gif' width='500'>
</p>

<h1 align="center">🍲 Simmer 🍲</h1>

<p align="center">
Simmer is your hands-free, voice-guided sous-chef in the kitchen! By reading recipes aloud step-by-step with voice command navigation, built-in timers, and recipe management, Simmer makes cooking stress-free and fun. Keep your hands clean, stay focused on the process, and let Simmer guide you through every delicious step.
</p>

---

## MVP ✅
* **User Registration/Login** → Secure authentication  
* **Enter Recipes** → Add recipes manually (title, ingredients, steps)  
* **Import Recipes** → Add recipes from social media (title, ingredients, steps)  
* **Voice-Guided Step-by-Step Instructions** → Reads instructions aloud while cooking  
* **Voice Command Navigation** → Commands like “Next step,” “Repeat,” “Go back”  
* **Built-in Timers** → Automatic timers during time-based steps  
* **Progress Indicator** → Visual progress tracker for current recipe step  

---

## Stretch Goals 💪
* **LLM-Powered Q&A** → Real-time cooking questions answered  
* **Music Integration** → Spotify / Apple Music API  
* **Personal Notes on Recipes** → Add modifications or cooking notes  
* **Pantry Mode** → Suggest recipes from available ingredients  
* **Export Recipes to PDF** → Store or share recipes offline  

---

## Tech Stack & Resources 💻
#### React Native (Expo) • FastAPI / Node.js • Firebase / PostgreSQL • Google Cloud TTS/STT  

<details>
<summary>📱 Frontend</summary>

* [React Native Docs](https://reactnative.dev/docs/getting-started)  
* [Expo Documentation](https://docs.expo.dev/)  
* [React Navigation](https://reactnavigation.org/)  
* [NativeWind Docs](https://www.nativewind.dev/)  

</details>

<details>
<summary>⚙️ Backend</summary>

* [FastAPI Documentation](https://fastapi.tiangolo.com/)  
* [Express.js Guide](https://expressjs.com/)  
* [Node.js Docs](https://nodejs.org/en/docs/)  

</details>

<details>
<summary>🔐 Auth</summary>

* [Google OAuth with FastAPI](https://developers.google.com/identity/protocols/oauth2)  
* [Passport.js](http://www.passportjs.org/)  
* [Firebase Authentication](https://firebase.google.com/docs/auth)  

</details>

<details>
<summary>🎙️ Voice Processing</summary>

* [Expo Speech](https://docs.expo.dev/versions/latest/sdk/speech/)  
* [Google Cloud Speech-to-Text](https://cloud.google.com/speech-to-text)  
* [OpenAI Whisper API](https://platform.openai.com/docs/guides/speech-to-text)  

</details>

<details>
<summary>🗄️ Database</summary>

* [Firebase Firestore](https://firebase.google.com/docs/firestore)  
* [PostgreSQL Docs](https://www.postgresql.org/docs/)  
* [Supabase](https://supabase.com/)  
* [AWS S3](https://aws.amazon.com/s3/)  

</details>

<details>
<summary>🎨 Design</summary>

* [Figma](https://www.figma.com/)  
* [LottieFiles](https://lottiefiles.com/)  

</details>

<details>
<summary>🛠️ Dev Tools</summary>

* [Git](https://git-scm.com/downloads)  
* [VS Code](https://code.visualstudio.com/download)  
* [Postman](https://www.postman.com/downloads/)  
* [Expo Go](https://expo.dev/client)  

</details>

---

## Roadmap 📅

<table>
  <tr>
    <th>Week</th>
    <th>Frontend</th>
    <th>Backend</th>
  </tr>
  <tr>
    <td>1</td>
    <td>Decide roles, discuss project plan, design day</td>
    <td>–</td>
  </tr>
  <tr>
    <td>2</td>
    <td>Set up Expo + React Native, design wireframes in Figma</td>
    <td>Set up FastAPI/Node, connect to DB, design schemas, OAuth setup</td>
  </tr>
  <tr>
    <td>3</td>
    <td>Build onboarding screens (login/signup)</td>
    <td>Implement OAuth flow & user creation in DB</td>
  </tr>
  <tr>
    <td>4</td>
    <td>Recipe input/import UI, recipe list display</td>
    <td>CRUD routes for recipes, connect frontend to API</td>
  </tr>
  <tr>
    <td>5</td>
    <td>Integrate manual recipe entry, start voice-guided UI</td>
    <td>–</td>
  </tr>
  <tr>
    <td>6</td>
    <td>Recipe detail view with progress tracker, import UI</td>
    <td>Timer & voice endpoints, parsing & recipe input API</td>
  </tr>
  <tr>
    <td>7</td>
    <td>Text-to-Speech, timer UI/controls, prep presentation</td>
    <td>Basic STT / voice command handling, prep presentation</td>
  </tr>
  <tr>
    <td>8</td>
    <td>Voice command navigation (next/repeat/back)</td>
    <td>Backend triggers for timers, save/resume recipe state</td>
  </tr>
  <tr>
    <td>9</td>
    <td>Polish UI (animations, error handling)</td>
    <td>Integrate Whisper STT + LLM parsing for extraction</td>
  </tr>
  <tr>
    <td>10</td>
    <td colspan="2" align="center">✨ Presentation Prep ✨</td>
  </tr>
</table>

---

## GitHub Cheat Sheet 💬

| Command | Description |
| ------ | ------ |
| **cd <director>** | Change directories over to our repository |
| **git branch** | Lists branches for you |
| **git branch "branch name"** | Makes new branch |
| **git checkout "branch name"** | Switch to branch |
| **git checkout -b "branch name"** | Same as 2 previous commands together |
| **git add .**| Finds all changed files |
| **git commit -m "Testing123"** | Commit with message |
| **git push origin "branch"** | Push to branch |
| **git pull origin "branch"** | Pull updates from a specific branch |
| get commit hash (find on github or in terminal run **git log --oneline** ) then **git revert 2f5451f --no-edit**| Undo a commit that has been pushed |
| **git reset --soft HEAD~** | Undo commit (not pushed) but *keep* the changes |
| get commit hash then **git reset --hard 2f5451f** | Undo commit (not pushed) and *remove*  changes |

## The Team 🎉

<div align="center">
<h2>🎊Developers🎊</h2>
<h3>Adrian Hautea</h3><br/>
<h3>Keshav Taneja</h3><br/>
<h3>Liana Forster</h3><br/>
<h3>Hieu Tran</h3><br/>
<h3>Patrick Enerio</h3><br/>
<h2>🎊Project Manager🎊</h2>
<h3>Suhani Rana</h3><br/>
<h2>🎊Industry Mentor🎊</h2>
<h3>Joanna Borba</h3><br/>
<div />

