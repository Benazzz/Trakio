import { Navigate, Route, Routes } from "react-router";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import GamesPage from "./pages/GamesPage";
import GamePage from "./pages/GamePage";
import RoundPage from "./pages/RoundPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/games" replace />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="games" element={<GamesPage />} />

        <Route element={<RequireAuth />}>
          <Route path="games/:gameId" element={<GamePage />} />
          <Route path="games/:gameId/rounds/:roundId" element={<RoundPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
