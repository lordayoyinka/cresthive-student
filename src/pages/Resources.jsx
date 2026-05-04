import { SearchIcon, SortAscendingIcon, ChevronDownIcon, FolderIcon } from '@heroicons/react/solid';
import { Menu } from '@headlessui/react'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';


import React, { useEffect, useState } from "react";
import { auth2, firestore } from "@/firebase/config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Loading from '@/components/Loading';
// Import your authentication context


const db = getFirestore();

const extractTextBeforeFirstPeriod = (inputString) => {
  const parts = inputString.split(".");
  return (parts[0] + "  " + parts[parts.length - 1]);
};


const handleNavigate = (classDocumentName, destination) => {
  router.push({
    pathname: `/${destination}`,
    query: { classDocumentName },
  }); 
};







const Resources = () => {
  const [loader, setloader] = useState(false);

  
  const year = localStorage.getItem("studentyear");
  const term = localStorage.getItem("studentterm");


  const [assignedSubjects, setAssignedSubjects] = useState([]);

  const user = auth2.currentUser;
  console.log("sub1:",auth2.currentUser)
  console.log("sub2:", user)

  


useEffect(() => {
  if (user) {
    // Get the UID of the logged-in student
    const studentUid = user.uid;
    console.log("data:", studentUid)


    // Assuming you have a reference to your Firestore collection
    const subjectsCollection = collection(db, year, term, 'subjects'); // Replace with your actual collection name
    setloader(true)


    // Fetch all subjects
    getDocs(subjectsCollection)
      .then((querySnapshot) => {
        const subjects = [];
        querySnapshot.forEach((doc) => {
          const subjectData = doc.data();
          console.log("data:", subjectData)
          // Check if the current student's UID is in the "Students" array
          
          if (subjectData.Students && Array.isArray(subjectData.Students)) {
            // Check if the current student's UID is in the "Students" array
            if (subjectData.Students.some((student) => student.uid === studentUid)) {
              subjects.push({ name: doc.id,  ...subjectData.Students });
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

        console.error('Error fetching assigned subjects: ', error);
      });
  }
}, []);


  return (

    <div className='overflow-y-auto h-full rounded-lg bg-indigo-50 p-4 pb-24 m-4'>
<div className='flex mb-6'>
      <div className="flex-1 flex justify-center lg:justify-end">
        <div className="w-full lg:px-2">
          <label htmlFor="search" className="sr-only">
            Search projects
          </label>
          <div className="relative text-white focus-within:text-gray-400">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5" aria-hidden="true" />
            </div>
            <input
              id="search"
              name="search"
              className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-0 focus:placeholder-gray-400 focus:text-gray-900 sm:text-sm"
              placeholder="Search projects"
              type="search"
            />
          </div>
        </div>
      </div>

      <Menu as="div" className="relative">
        <Menu.Button className="w-full bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 inline-flex justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <SortAscendingIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
          Sort
          <ChevronDownIcon className="ml-2.5 -mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
        </Menu.Button>
        <Menu.Items className="origin-top-right z-10 absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={`${
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
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
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
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
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
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
    <h2 className="font-semibold font-32 opacity-50">Your Subjects</h2>
    <p className="text-xs opacity-60 mb-5">This are the subjects you are offering this term</p>

    <ul
      role="list"
      className="grid gap-2 grid-cols-2 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5"
    >
      {assignedSubjects.map((subject) => (
        <a href={`./ResPart?subject=${subject.name}`}><li
          key={subject.name}
          className="w-full  m-2 justify-self-start p-2 align-self-start flex-1 text-start bg-gray-50 rounded-lg shadow "
        >
          <div className="flex-1 flex flex-col p-2 ">

          <div className='flex justify-between'>
          <FolderIcon
              className="w-12 h-12 flex-shrink-0  "
              alt=""
            />

          
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
  
  </div>    


  <div className="absolute top-0 left-0">
        <Loading newstate={loader} />
        </div>
    </div>
  )
}

export default Resources