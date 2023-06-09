import 'amfe-flexible/index.js'
import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/index.less';
import '@/common/style/base.less';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
const Chat = React.lazy(() => import('@/pages/chat/index'));
const Article = React.lazy(() => import('@/pages/article'));

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="chat" element={<Chat />} />
        <Route path="article" element={<Article />} />
        {/* <Route path="invoices" element={<Invoices />} /> */}
      </Routes>
    </BrowserRouter>,
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
