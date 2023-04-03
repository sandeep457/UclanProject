import React from 'react'
import Header from './Header'
import Sidebar from "./Sidebar";
import "../styles/Inquire.css";
import InquireFeed from "./InquireFeed";
import Widget from './Widget';
export const UserContext = React.createContext();

export default function Dashboard() {
  return (
    <div>
      <div className="inquire">
      <Header />
      <div className="inquire__contents">
        <div className="inquire__content">
          <Sidebar />
          <InquireFeed />
          <Widget/>
        </div>
      </div>
    </div>
    </div>
  )
}
