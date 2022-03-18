import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "components";
import { HomePage } from "pages";
import { BookDetail } from "pages/BookDetail";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:id" element={<BookDetail />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
