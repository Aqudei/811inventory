import { Route, Routes } from "react-router";
import "./App.css";
import Scanner from "./components/Scanner";
import Layout from "./layouts/default";
import { Login } from "./routes/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import ItemForm from "./routes/ItemForm";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login></Login>} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Scanner />} />
        <Route path="item-form/" element={<ItemForm />} />
      </Route>
    </Routes>
  );
}

export default App;
