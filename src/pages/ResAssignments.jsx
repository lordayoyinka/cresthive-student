import React, { useState, useEffect } from "react";
import {
  SearchIcon,
  SortAscendingIcon,
  ChevronDownIcon,
} from "@heroicons/react/solid";
import { Menu } from "@headlessui/react";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";

const ResDocs = () => {
  const [loader, setloader] = useState(false);


  const year = localStorage.getItem("studentyear");
  const term = localStorage.getItem("studentterm");



  const [assignments, setassignments] = useState([]);

  const [subjectName, setSubjectName] = useState("");
  const [selectedassignment, setSelectedassignment] = useState(null);

  const db = getFirestore();
  const storage = getStorage(); // Initialize Firebase Storage
  const storageRef = ref(storage, `assignments`); // Change 'assignments' to your storage path

  const router = useRouter();
  useEffect(() => {
    const { subject } = router.query;
    if (subject) {
      setSubjectName(subject);
    }
  }, [router.query]);

  useEffect(() => {
    // Load existing assignments for the subject from Firestore
    const loadassignments = async () => {

      if (subjectName) {
        setloader(true)

        console.log("trying to load");
        try {
          const q = collection(db, year, term, `subjects/${subjectName}/assignments`); // Change 'assignments' to your Firestore collection name;
          const querySnapshot = await getDocs(q);
          console.log("trying to load", querySnapshot);

          const assignmentList = [];
          querySnapshot.forEach((doc) => {
            assignmentList.push({ id: doc.id, ...doc.data() });
          });
          setassignments(assignmentList);
          setloader(false)

        } catch (error) {
          setloader(false)

          console.error("Error loading assignments:", error);
          alert("Error loading assignments! \n", error.message);
        }
      }
    };


    loadassignments();
  }, [db, subjectName]);



  const handleassignmentClick = (assignmentUrl) => {
    setSelectedassignment(assignmentUrl);
    console.log(selectedassignment);

  };


  return (
    <div className="overflow-y-auto flex-col flex h-full rounded-lg bg-indigo-50 p-4 pb-24 m-4">
      <div className="flex mb-6">
        

        
      </div>
      <div></div>


      <div>
        <div className="mb-5 bg-white p-6 rounded-lg">
          <h2 className="font-semibold text-lg pb-4 opacity-50">
            All assignments for {subjectName}
          </h2>

          <ul
            role="list"
            className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-6"
          >
            {assignments.map((assignmentitem) => (

              <li
                key={assignmentitem.email}
                className="w-full justify-self-start  align-self-start flex-1 text-start bg-gray-50 rounded-lg shadow">
                <a


                  onClick={() => handleassignmentClick(assignmentitem.downloadURL)}
                  href={selectedassignment}


                >

                  <div className="flex-1 p-2 flex flex-col p-2">
                    <div className="flex justify-between">
                      <img
                        className="w-18 h-16 flex-shrink-0"
                        src={
                          assignmentitem.type === "word"
                            ? "/Assets/google-docs.png"
                            : "/Assets/pdf-file.png"
                        }
                        alt=""
                      />
                    </div>
                    <div className="flex-col">
                      <h3 className="mt-2 text-gray-900 font-medium">
                        {assignmentitem.name}
                      </h3>
                      <h3 className="text-red-900 place-content-bottom text-xs font-medium">
                        {assignmentitem.date}
                      </h3>

                    </div>
                  </div>
                  <div></div>
                </a>
              </li>

            ))}
          </ul>
        </div>
      </div>

      {/* Button to open the Add assignment popup */}

      <div className="absolute top-0 left-0">
        <Loading newstate={loader} />
      </div>





    </div>
  );
};

export default ResDocs;
