
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Register from './pages/Register';
import Login from './pages/Login';
import UserChatPage from './pages/UserChatPage';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/AdminDashboard';
import AdminChat from './components/AdminChat';
import ChatList from './components/ChatList';
import UserChat from './components/UserChat';
import ChatPage from './pages/ChatPage';
import Profile from './pages/Profile';
import MailOTP from './pages/MailOTP';
import Sidebar from './components/Sidebar';
import UserDashboard from './pages/Userdashboard';
import Myorders from './pages/Myorders';
import AdminChatPage from './pages/AdminChatPage';
import Admin from './pages/Admin';
import AdminCategory from './pages/AdminCategory';
function App() {
  return (  
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/UserChatPage" element={<UserChatPage />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/chatList" element={<ChatList />} />
        <Route path="/adminchat" element={<AdminChat />} />
        <Route path="/userchat" element={<UserChat />} />
        <Route path="/chatpage" element={<ChatPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/mailotp" element={<MailOTP />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/myorders" element={<Myorders />} />
        <Route path="/adminchatpage" element={<AdminChatPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admincategory" element={<AdminCategory />} />
      </Routes>
     </BrowserRouter>
  );
}

export default App;
