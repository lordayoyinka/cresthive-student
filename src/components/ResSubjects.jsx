import React, { useEffect, useState } from "react";
import { auth2 } from "@/firebase/config";
import { collection, getDoc, doc, getDocs, getFirestore } from 'firebase/firestore';
// Import your authentication context



const extractTextBeforeFirstPeriod = (inputString) => {
  const parts = inputString.split(".");
  return parts[0] ;
};

const extractTextAfterLastPeriod = (inputString) => {
    const parts = inputString.split(".");
    return parts[parts.length - 1];
  };

const  ResSubjects = () => {
  console.log("here too");

  
  const year = localStorage.getItem("studentyear");
  const term = localStorage.getItem("studentterm");


  console.log("tny", year, term)


  
const db = getFirestore();
const user = auth2.currentUser;
console.log("here");


  const [isSeeReportsModalOpen, setIsSeeReportsModalOpen] = useState(false);
  const [selectedsubject, setselectedsubject] = useState([]);
  const [Subjects, setAssignedSubjects] = useState([]);

    
    useEffect(() => {
      function scores (){
        if (user) {
          // Get the UID of the logged-in student
          const studentUid = user.uid;
          console.log("myuid:", studentUid);
      
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
              setAssignedSubjects(subjects);
              console.log("Data23", subjects);
            })
            .catch((error) => {
              console.error("Error fetching assigned subjects: ", error);
              alert("Error fetching assigned subjects")
            });
        }
      }

      scores();
   
    }, [user]);

    
  const handleReportspop = async (subselected) => {

    const db = getFirestore();

    setIsSeeReportsModalOpen(true);

    console.log(subselected, "subselected")

    const docref = doc(db, year, term, "subjects", subselected);
    const q = await getDoc(docref);
    const data = q.data();

    if(data){

      const reps = data.Reports;

      console.log(reps, "reps")

      if(reps){

        reps.forEach((doc) =>{


          if(doc.uid ===  user.uid){

            console.log("score", doc)

            setselectedsubject(doc);
          }

        });
      }

    }



  }


  return (
    <div className = 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-3'>
        {Subjects.map((subject) => {
            return (
                <div className = 'bg-white  grow  relative rounded-lg'>
                    <div className = 'bg-green-200 p-4 rounded-b-xl'>
                        <h1 className = 'pt-10 pb-3  text-[#3C3C3C] text-2xl font-bold'>{extractTextAfterLastPeriod(subject.name)}</h1>
                        <h3 className = 'text-slate-700 font-semibold text-lg'>Class: {extractTextBeforeFirstPeriod(subject.name)}</h3>
                    </div>
                    <div className = 'p-4'>
                        
                        <button onClick={() => handleReportspop(subject.name)} className = 'bg-[#02681F] text-white w-full text-center p-2 rounded-lg'>View details</button>
                    </div>








                    {isSeeReportsModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-indigo-50 p-4 rounded shadow-lg p-2">

          <div>
          <p className="text-2xl p-4 mb-8 font-bold"> Summary of scores</p>

          <div className="bg-white py-4 rounded-2xl p-2 px-4">
          <p className="text-md font-semibold">1st Test: <span className="pl-8">{selectedsubject.testScore}</span> </p>
          <p className="text-md font-semibold">2nd Test: <span className="pl-8">{selectedsubject.testScore2}</span> </p>
          <p className="text-md font-semibold">Exam: <span className="pl-8">{selectedsubject.examScore} </span></p>
          </div>

          </div>
           
            <button
              onClick={() => {setIsSeeReportsModalOpen(false);
              setselectedsubject([])}}
              className="bg-gray-500 my-4 text-white py-2 px-4 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
                </div>
                
            )
        })}
    </div>
  )
}

export default ResSubjects