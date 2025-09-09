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

## Competition ⚔️

* **YouTube/Tasty** → Visually engaging, but not hands-free  
* **Yummly/Paprika** → Recipe management, limited voice guidance  
* **Google Home** → Voice navigation, but no recipe library/imports  
* **Deglaze** → Recipe import, but no conversational voice steps  

✅ **Simmer’s Advantage**: Combines **hands-free TTS guidance, voice command navigation, recipe storage/import, and LLM-powered Q&A** in a single lightweight app!  

---

## Roadblocks & Solutions 🛠️
* **STT Accuracy in noisy kitchens** → Use keyword detection, wake words, confirmation beeps/vibrations  
* **Cross-Platform TTS/STT** → Expo Speech + Google Cloud for consistency  
* **Video Parsing Complexity** → Whisper + LLM structured prompts + user confirmation  
* **Device Constraints** → Cloud storage (S3/Firestore), async processing, caching  
* **OAuth Debugging** → Expo AuthSession, Firebase Auth, Postman for testing  

---

## GitHub Cheat Sheet 💬

| Command | Description |
| ------ | ------ |
| **git branch** | List branches |
| **git checkout -b "branch"** | Create & switch to new branch |
| **git add .** | Stage all changes |
| **git commit -m "msg"** | Commit changes |
| **git push origin branch** | Push changes |
| **git pull origin branch** | Pull updates |
| **git revert hash** | Undo a pushed commit |
| **git reset --soft HEAD~** | Undo last commit, keep changes |
| **git reset --hard hash** | Undo last commit, remove changes |
