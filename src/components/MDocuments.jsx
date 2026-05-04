import React from "react";
import foldericon from "../assests/foldericon.png";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth2 } from "@/firebase/config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  SearchIcon,
  SortAscendingIcon,
  ChevronDownIcon,
  FolderIcon,
} from "@heroicons/react/solid";

// Import your authentication context

const MDocuments = () => {
  
  const year = localStorage.getItem("studentyear");
  const term = localStorage.getItem("studentterm");



  const db = getFirestore();

  const extractTextBeforeFirstPeriod = (inputString) => {
    const parts = inputString.split(".");
    return parts[0] + "  " + parts[parts.length - 1];
  };

  const [assignedSubjects, setAssignedSubjects] = useState([]);

  const user = auth2.currentUser;
  console.log("sub1:", auth2.currentUser);
  console.log("sub2:", user);

  useEffect(() => {
    if (user) {
      // Get the UID of the logged-in student
      const studentUid = user.uid;
      console.log("data:", studentUid);

      // Assuming you have a reference to your Firestore collection
      const subjectsCollection = collection(db, year, term, "subjects"); // Replace with your actual collection name

      // Fetch all subjects
      getDocs(subjectsCollection)
        .then((querySnapshot) => {
          const subjects = [];
          querySnapshot.forEach((doc) => {
            const subjectData = doc.data();
            console.log("data:", subjectData);
            // Check if the current student's UID is in the "Students" array

            if (subjectData.Students && Array.isArray(subjectData.Students)) {
              // Check if the current student's UID is in the "Students" array
              if (
                subjectData.Students.some(
                  (student) => student.uid === studentUid
                )
              ) {
                subjects.push({ name: doc.id, ...subjectData.Students });
                console.log("Data2:", subjects);
              }
            }
          });


          if (subjects.length > 4) {
            
          const docs = [];

            for (let i = 0; i < 4; i++) {
              docs.push(subjects[i]);
            }
            setAssignedSubjects(docs);


          }else{

            setAssignedSubjects(subjects);

          }
          console.log("Data23", subjects);
        })
        .catch((error) => {
          console.error("Error fetching assigned subjects: ", error);
        });
    }
  }, []);

  if(!assignedSubjects){
    return (
      <div>

      </div>
    );
  }

  return (
    <div className="bg-white md:pb-8 max-h-max shadow-lg mx-8 m-2 p-4 rounded-lg">
      <div className=" ">
        <h2 className="font-bold font-32 opacity-50 ">Resources</h2>
        <p className="text-xs opacity-60 mb-5">Academic resources</p>

        <ul
          role="list"
          className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >

          {assignedSubjects.map((subject) => (
            <a href={`./ResPart?subject=${subject.name}`}>
              <li
                key={subject.name}
                className="w-full m-2 justify-self-start p-2 align-self-start flex-1 text-start bg-gray-50 rounded-lg shadow "
              >
                <div className="flex-1 flex flex-col p-2 ">
                  <div className="flex justify-between">
                    <FolderIcon className="w-12 h-12 flex-shrink-0  " alt="" />
                  </div>

                  <h3 className="mt-6 text-gray-900 text-xs font-medium">
                    {extractTextBeforeFirstPeriod(subject.name)}
                  </h3>
                </div>
                <div></div>
              </li>
            </a>
          ))}
        </ul>
      </div>
      <a
        href="./Resources"
        className="flex justify-end text-[#6956E5] hover:underline"
      >
        View all
      </a>
    </div>
  );
};

export default MDocuments;
