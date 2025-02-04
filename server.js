const express = require("express");
const cors = require("cors");
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set, get } = require("firebase/database");

// ✅ Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyDfe48zlcHIy4Y6QVRWuEO1ImcaBF5pcw4",
    authDomain: "rpg-database-a.firebaseapp.com",
    databaseURL: "https://rpg-database-a-default-rtdb.firebaseio.com",
    projectId: "rpg-database-a",
    storageBucket: "rpg-database-a.firebasestorage.app",
    messagingSenderId: "225664851456",
    appId: "1:225664851456:web:0a2a48bc5c1cec5ea342e5"
};

// ✅ Firebase 초기화
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

const app = express();
app.use(cors());
app.use(express.json());

// ✅ 주민 추가 API (뤼튼이 호출할 수 있는 엔드포인트)
app.post("/addResident", async (req, res) => {
    const { playerID, name, age, trait, job } = req.body;
    const dbRef = ref(database, `players/${playerID}/residents/${name}`);

    try {
        await set(dbRef, { age, trait, job });
        res.json({ success: true, message: "✅ 주민 추가 성공!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ 오류 발생!", error });
    }
});

// ✅ 주민 목록 가져오기 API
app.get("/getResidents/:playerID", async (req, res) => {
    const playerID = req.params.playerID;
    const dbRef = ref(database, `players/${playerID}/residents`);

    try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            res.json({ success: true, residents: snapshot.val() });
        } else {
            res.json({ success: false, message: "❌ 주민 없음" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ 오류 발생!", error });
    }
});

// ✅ 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🔥 API 서버 실행 중: http://localhost:${PORT}`);
});
