import React, { useState, useEffect } from "react";
import Group from '../assests/Group.png'
import Performance from './../assests/Performance.png'
import Icons from '../assests/Icons.png'
import { getFirestore, doc, getDoc, getDocs, collection } from "firebase/firestore";
import { auth2 } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";





const Studentsoverview = () => {



  const year = localStorage.getItem("studentyear");
  const term = localStorage.getItem("studentterm");


  const [user, setUser] = useState(null);


  const [totalstudents, settotalstudents] = useState();
  const [totalsubjects, settotalsubjects] = useState();

  const [totalattendance, settotalattendance] = useState();
  const [markedDates2, setMarkedDates] = useState([]); // Store marked dates


  const [userdata, setuserdata] = useState("");
  // Store marked dates






  useEffect(() => {
    // Use Firebase's onAuthStateChanged to listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth2, (authUser) => {
      if (authUser) {
        // User is authenticated, set the user state
        setUser(authUser);

        console.log("user set")
      } else {
        // User is not authenticated, set the user state to null
        setUser(null);
      }
    });

    // Cleanup the listener when the component unmounts
    return () => {
      unsubscribe();

    };
  }, []);


  useEffect(() => {


    // Fetch marked dates from the attendance collection
    const fetchMarkedDates = async () => {
      if (userdata) {
        try {


          // Replace 'classname' with your class name
          const classnameset = userdata;
          const attendanceRef = collection(db, year, term, 'classes', userdata, 'Attendance');
          const markedDatesSnapshot = await getDocs(attendanceRef);
          const markedDates = [];

          console.log(markedDatesSnapshot, "dates")


          markedDatesSnapshot.forEach((doc) => {
            const data = doc.data();
            console.log(data, "data")


            const uid = user.uid;

            if (data && data.students) {
              console.log(data.students, "students")
              if (data.students.some((student) => (student.id === user.uid) && (student.present === true))) {
                markedDates.push(doc.id);

              }

            }
          });


          console.log("checkdate", markedDates.length, markedDates2.length);

          const calculate = ((markedDates.length / markedDates2.length) * 100);

          settotalattendance(calculate.toFixed(2) + "%")

        } catch (error) {
          console.error('Error fetching marked dates:', error);
        }

      }
    };

    fetchMarkedDates();

  }, [user, markedDates2, userdata]);



  useEffect(() => {



    // Fetch marked dates from the attendance collection
    const fetchMarkedDates = async () => {
      if (userdata) {
        try {
          // Replace 'classname' with your class name

          const classname = userdata;
          const attendanceRef = collection(db, year, term, 'classes', classname, 'Attendance');
          const markedDatesSnapshot = await getDocs(attendanceRef);
          const markedDates = [];

          markedDatesSnapshot.forEach((doc) => {
            markedDates.push(doc.id);
          });



          setMarkedDates(markedDates);
        } catch (error) {
          console.error('Error fetching marked dates:', error);
        }
      }
    };

    fetchMarkedDates();


  }, [userdata]);








  const db = getFirestore();




  useEffect(() => {

    const myfunc = async () => {

      if (auth2.currentUser) {


        const curuser = auth2.currentUser;

        const ref = doc(db, year, term, "students", curuser.uid);
        console.log("curruse", curuser)


        const snap = await getDoc(ref);

        const data = snap.data();
        console.log("selcla1", snap)


        if (data) {
          console.log("selcla", data)
          setuserdata(data.selectedClass);
        }

      }

    }

    myfunc();

  }, [auth2.currentUser])


  useEffect(() => {


    const fetchstudentsno = async () => {

      const db = getFirestore();


      if (userdata) {



        const docref = doc(db, year, term, "classes", userdata);
        const q = await getDoc(docref);
        const data = q.data();

        console.log(data, "qdata")

        if (data) {

          const students = data.students || [];

          if (students.length) {

            console.log(students.length, "number")

            settotalstudents(students.length)
          }

        }


      }


    }


    fetchstudentsno();



  }, [userdata])








  useEffect(() => {

    const runoff = () => {
      if (user) {
        // Get the UID of the logged-in student
        const studentUid = user.uid;
        console.log("data:", studentUid)


        // Assuming you have a reference to your Firestore collection
        const subjectsCollection = collection(db, year, term, 'subjects'); // Replace with your actual collection name

        // Fetch all subjects
        getDocs(subjectsCollection)
          .then((querySnapshot) => {
            const subjects = [];
            querySnapshot.forEach((doc) => {
              const subjectData = doc.data();
              console.log("data1:", subjectData)
              // Check if the current student's UID is in the "Students" array

              if (subjectData.Students && Array.isArray(subjectData.Students)) {
                // Check if the current student's UID is in the "Students" array
                if (subjectData.Students.some((student) => student.uid === studentUid)) {
                  subjects.push({ name: doc.id, ...subjectData.Students });
                  console.log("Data2:", subjects);
                }
              }
            });
            settotalsubjects(subjects.length);
            console.log("Data23", subjects);

          })
          .catch((error) => {
            console.error('Error fetching assigned subjects: ', error);
          });
      }
    }

    runoff();
  }, [user]);






  return (
    <div>
      <div className=" bg-white p-4  rounded-lg">
        <h2 className="font-semibold font-32 opacity-50">Overview</h2>
        <p className="text-xs opacity-60 mb-5">Academic Progress</p>

        <ul
          role="list"
          className="grid  gap-12  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >


          <li

            className="w-full justify-self-center p-2 mb-2 align-self-start col-span-1 flex flex-col text-start bg-gray-50 rounded-lg shadow "
          >
            <div className="flex-1 flex flex-col p-2 pb-4">
              <img
                className="w-6 h-6 flex-shrink-0 "
                src="./Assets/User.png"
                alt=""
              />
              <h3 className="mt-6 text-gray-900 text-xl font-medium">
                {totalstudents}
              </h3>
              <dl className="mt-1 flex-grow flex flex-col justify-between">
                <dt className="sr-only">Title</dt>
                <dd className="text-gray-500 text-sm">Total Students in class</dd>
                <dt className="sr-only">Role</dt>
                <dd className="mt-3">
                  <span className="px-2 py-1 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                    Students

                  </span>
                </dd>
              </dl>
            </div>
            <div></div>
          </li>


          <li

            className=" w-full justify-self-center p-2 mb-2 align-self-start col-span-1 flex flex-col text-start bg-gray-50 rounded-lg shadow "
          >
            <div className="flex-1 flex flex-col p-2 pb-4">
              <img
                className="w-6 h-6 flex-shrink-0 "
                src="./Assets/Manalytics.png"
                alt=""
              />
              <h3 className="mt-6 text-gray-900 text-xl font-medium">
                {totalattendance}
              </h3>
              <dl className="mt-1 flex-grow flex flex-col justify-between">
                <dt className="sr-only">Title</dt>
                <dd className="text-gray-500 text-sm">Total Times Present</dd>
                <dt className="sr-only">Role</dt>
                <dd className="mt-3">
                  <span className="px-2 py-1 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                    Attendance

                  </span>
                </dd>
              </dl>
            </div>
            <div></div>
          </li>



          <li

            className=" w-full justify-self-center p-2 mb-2 align-self-start col-span-1 flex flex-col text-start bg-gray-50 rounded-lg shadow "
          >
            <div className="flex-1 flex flex-col p-2 pb-4">
              <img
                className="w-6 h-6 flex-shrink-0 "
                src="./Assets/Mrecord.png"
                alt=""
              />
              <h3 className="mt-6 text-gray-900 text-xl font-medium">
                {totalsubjects}
              </h3>
              <dl className="mt-1 flex-grow flex flex-col justify-between">
                <dt className="sr-only">Title</dt>
                <dd className="text-gray-500 text-sm">Total Subjects Offered</dd>
                <dt className="sr-only">Role</dt>
                <dd className="mt-3">
                  <span className="px-2 py-1 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                    Subjects

                  </span>
                </dd>
              </dl>
            </div>
            <div></div>
          </li>



        </ul>
      </div>
    </div>
  );
};

export default Studentsoverview;