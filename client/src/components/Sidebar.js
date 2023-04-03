import React from 'react'
import "../styles/Sidebar.css";
import { useCategoryStore } from  '../store/store';

function Sidebar() {
let setCategory  = useCategoryStore(state => state.setCategory);
const handleChange = (event,value) => {
    var elems = document.querySelectorAll("li");
    [].forEach.call(elems, function(el) {
        el.classList.remove("active");
    });
    event.target.classList.add('active');
    setCategory(value);
};

  return (
    <aside>
    <p> Category </p>
    <li id='None' onClick={(event) => handleChange(event,"None")}>
    <i className="fa-solid fa-list"></i>
      All Questions
    </li>
    <li id='FreshersHub' onClick={(event) => handleChange(event,"FreshersHub")}>
    <i className="fa-sharp fa-solid fa-person-military-to-person"></i>
      Freshers Hub
    </li>
    <li id='MSCComputing' onClick={(event) => handleChange(event,"MSCComputing")}>
      <i className="fa fa-laptop" aria-hidden="true"></i>
      MSC Computing
    </li>
    <li id='CurricularActivities' onClick={(event) => handleChange(event,"CurricularActivities")}>
    <i className="fa-sharp fa-solid fa-gamepad"></i>
      Curricular Activities
    </li>
    <li id='ModulesRelated' onClick={(event) => handleChange(event,"ModulesRelated")}>
    <i className="fa-sharp fa-solid  fa-book"></i>
      Modules Related
    </li>
    <li id='Assignments' onClick={(event) => handleChange(event,"Assignments")}>
    <i className="fa-solid fa-pen-to-square"></i>
      Assignments & Exams
    </li>
  </aside>
  )
}

export default Sidebar