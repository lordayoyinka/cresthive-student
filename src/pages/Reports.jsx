import {
  SearchIcon,
  SortAscendingIcon,
  ChevronDownIcon,
  FolderIcon,
} from "@heroicons/react/solid";
import { Menu } from "@headlessui/react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth2, firestore } from "@/firebase/config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import Loading from "@/components/Loading";
// Import your authentication context

const db = getFirestore();

const extractTextBeforeFirstPeriod = (inputString) => {
  const parts = inputString.split(".");
  return parts[0] + "  " + parts[parts.length - 1];
};

const Reports = () => {
  const [loader, setloader] = useState(false);

  
  const year = localStorage.getItem("studentyear");
  const term = localStorage.getItem("studentterm");




  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [isSeeReportsModalOpen, setIsSeeReportsModalOpen] = useState(false);
  const [selectedsubject, setselectedsubject] = useState([]);
  const [selectedsubject2, setselectedsubject2] = useState([]);
  




  const user = auth2.currentUser;
  console.log("sub1:", auth2.currentUser);
  console.log("sub2:", user);

  useEffect(() => {
    if (user) {
      // Get the UID of the logged-in student
      const studentUid = user.uid;
      console.log("data:", studentUid);

      setloader(true)


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
          setloader(false)

        })
        .catch((error) => {
          setloader(false)

          console.error("Error fetching assigned subjects: ", error);
        });
    }
  }, []);


  useEffect (()=> {

    setselectedsubject2(selectedsubject);
    console.log("upd", selectedsubject)



  },[selectedsubject])

  const handleReportspop = async (subselected) => {

    setIsSeeReportsModalOpen(true);

    const docref = doc(db, year, term, "subjects", subselected);
    const q = await getDoc(docref);
    const data = q.data();

    if(data){

      const reps = data.Reports;

      console.log(reps, "reps")

      if(reps){

        reps.forEach((doc) =>{

          console.log("dataaa", reps)


          if(doc.uid ===  user.uid){

            setselectedsubject(doc);
            console.log("selected sub", doc)
          }else{

            console.log("user not found")
          }

        });
      }else{

      }

    }



  }

  return (
    <div className="overflow-y-auto h-full rounded-lg bg-indigo-50 p-4 pb-24 m-4">
      <div className="flex mb-6">
        

        <Menu as="div" className="relative">
          <Menu.Button className="w-full bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 inline-flex justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <SortAscendingIcon
              className="mr-3 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            Sort
            <ChevronDownIcon
              className="ml-2.5 -mr-1.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Menu.Button>
          <Menu.Items className="origin-top-right z-10 absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={`${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    } block px-4 py-2 text-sm`}
                  >
                    Name
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={`${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    } block px-4 py-2 text-sm`}
                  >
                    Date modified
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={`${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    } block px-4 py-2 text-sm`}
                  >
                    Date created
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      </div>

      <div>
        <div className=" ">
          <h2 className="font-semibold font-32 opacity-50">Subject Reports</h2>
          <p className="text-xs opacity-60 mb-5">
            This are the subjects you are offering this term (Go to your profile
            to check your Report Card)
          </p>

          <ul
            role="list"
            className="grid gap-2 grid-cols-2 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5"
          >
            {assignedSubjects.map((subject) => (
              <li
                key={subject.name}
                className="w-full  m-2 justify-self-start p-2 align-self-start flex-1 text-start bg-gray-50 rounded-lg shadow "
                onClick={() => handleReportspop(subject.name)}
              >
                <div className="flex-1 flex flex-col p-2 ">
                  <div className="flex justify-between">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-12 h-12 flex-shrink-0  "
                      alt=""
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zM9.75 17.25a.75.75 0 00-1.5 0V18a.75.75 0 001.5 0v-.75zm2.25-3a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75zm3.75-1.5a.75.75 0 00-1.5 0V18a.75.75 0 001.5 0v-5.25z"
                        clipRule="evenodd"
                      />
                      <path d="M14.25 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0016.5 7.5h-1.875a.375.375 0 01-.375-.375V5.25z" />
                    </svg>
                  </div>

                  <h3 className="mt-6 text-gray-900 text-xs font-medium">
                    {extractTextBeforeFirstPeriod(subject.name)}
                  </h3>
                </div>
                <div></div>
              </li>
            ))}
          </ul>
        </div>
      </div>




      
      {isSeeReportsModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-indigo-50 p-4 rounded shadow-lg p-2">

          <div>
          <p className="text-2xl p-4 mb-8 font-bold"> Summary of scores</p>

          <div className="bg-white py-4 rounded-2xl p-2 px-4">
          <p className="text-md font-semibold">1st Test: <span className="pl-8">{selectedsubject2.testScore || ""}</span> </p>
          <p className="text-md font-semibold">2nd Test: <span className="pl-8">{selectedsubject2.testScore2 || ""}</span> </p>
          <p className="text-md font-semibold">Exam: <span className="pl-8">{selectedsubject2.examScore || ""} </span></p>
          </div>

          </div>
           
            <button
              onClick={() => {setIsSeeReportsModalOpen(false);
              setselectedsubject([])
              }}
              className="bg-gray-500 my-4 text-white py-2 px-4 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    

    <div className="absolute top-0 left-0">
        <Loading newstate={loader} />
        </div>
    </div>
  );
};

export default Reports;
