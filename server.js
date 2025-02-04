const express = require("express");
const cors = require("cors");
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set, get } = require("firebase/database");

// 🔥 Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyDfe48zlcHIy4Y6QVRWuEO1ImcaBF5pcw4",
    authDomain: "rpg-database-a.firebaseapp.com",
    databaseURL: "https://rpg-database-a-default-rtdb.firebaseio.com",
    projectId: "rpg-database-a",
    storageBucket: "rpg-database-a.appspot.com",
    messagingSenderId: "225664851456",
    appId: "1:225664851456:web:ea24b8bc5c1cec5ea342e5"
};

// Firebase 초기화
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 한글 포함된 요청 처리 (디코딩 함수)
const decodeParam = (param) => decodeURIComponent(param);

// ✅ 주민 추가 API (POST 요청)
app.post("/addResident", async (req, res) => {
    const { playerID, name, age, trait, job } = req.body;

    // 플레이어 ID와 이름이 없으면 에러 처리
    if (!playerID || !name) {
        return res.status(400).json({ success: false, message: "❌ 플레이어 ID와 이름을 입력해야 합니다." });
    }

    const decodedPlayerID = decodeParam(playerID);
    const decodedName = decodeParam(name);
    const dbRef = ref(database, `players/${decodedPlayerID}/residents/${decodedName}`);

    try {
        await set(dbRef, { age, trait, job });
        res.json({ success: true, message: "✅ 주민 추가 완료!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ 데이터 저장 중 오류 발생!", error });
    }
});

// ✅ 주민 목록 가져오기 API (GET 요청)
app.get("/getResidents/:playerID", async (req, res) => {
    const playerID = decodeParam(req.params.playerID);
    const dbRef = ref(database, `players/${playerID}/residents`);

    try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            res.json({ success: true, residents: snapshot.val() });
        } else {
            res.json({ success: false, message: "❌ 주민 없음" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ 데이터 불러오기 오류!", error });
    }
});

// ❌ GET /addResident 방지 (잘못된 요청 대비)
app.get("/addResident", (req, res) => {
    res.status(405).json({ success: false, message: "❌ 잘못된 요청입니다. POST 요청만 허용됩니다." });
});

// ✅ 서버 상태 확인 API
app.get("/", (req, res) => {
    res.send("✅ 서버가 정상적으로 실행 중입니다!");
});

// ✅ 서버 실행 (Render에서 외부 접근 가능하도록 수정)
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 API 서버 실행 중: http://localhost:${PORT}`);
});

const cors = require("cors");

app.use(cors({
    origin: "*",  // 모든 출처 허용
    methods: ["GET", "POST"],  // 허용할 HTTP 메서드
    allowedHeaders: ["Content-Type"]
}));
