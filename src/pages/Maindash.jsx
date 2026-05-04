import React from "react";
import Studentsoverview from "../components/MStudentsoverview";
import MProgressbars from "../components/MProgressbars";
import MGuagechart from "../components/MGuagechart";
import MNotifications from "../components/MNotifications";
import MDocuments from "../components/MDocuments";

const Maindash = () => {
  return (
    <div className="overflow-y-auto overscroll-y-auto h-screen rounded-lg bg-indigo-50 py-4 px-4 m-4 pb-20">
      <div className="gap-4 md:flex  sm:block">
        <div className="flex-1">
          <Studentsoverview />
        </div>

        
        </div>

      <div className="md:flex bg-white rounded-lg mt-2 sm:block">
        <div className="grow grid-cols-1   sm:block">
          
            <MGuagechart />
            <MDocuments className=" max-h-max px-4"/>
          
          
        </div>
        <div className="flex shadow-lg rounded-lg m-2 lg:w-1/3 md:w-full sm:w-full">
          <MNotifications />
        </div>
      </div>

    
    </div>
  );
};


export default Maindash