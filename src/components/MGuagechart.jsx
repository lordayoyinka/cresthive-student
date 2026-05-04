import React, { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, getDocs, collection } from "firebase/firestore";
import { auth2 } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";

import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";




const MGuagechart = () => {

  const year = localStorage.getItem("studentyear");
  const term = localStorage.getItem("studentterm");



  const [totalattendance, settotalattendance] = useState();
  const [markedDates2, setMarkedDates] = useState([]); // Store marked dates
  const [userdata, setuserdata] = useState("");

  const db = getFirestore();


  useEffect(() => {
    const myfunc = async () => {

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

    myfunc();
  }, [])





  const [user, setUser] = useState(null);
  const [userclass, setuserclass] = useState([]);


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
      try {


        // Replace 'classname' with your class name
        if (userdata) {
          const attendanceRef = collection(db, year, term, 'classes', userdata, 'Attendance');
          const markedDatesSnapshot = await getDocs(attendanceRef);
          const markedDates = [];

          console.log(markedDatesSnapshot, "dates")


          markedDatesSnapshot.forEach((doc) => {
            const data = doc.data();
            console.log(data, "data ski")


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

          settotalattendance(calculate.toFixed(2))

        }

      } catch (error) {
        console.error('Error fetching marked dates:', error);

      }

    };

    fetchMarkedDates();
  }, [user, markedDates2, userdata]);



  useEffect(() => {
    // Fetch marked dates from the attendance collection
    const fetchMarkedDates = async () => {
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
    };

    fetchMarkedDates();
  }, [userdata]);






  return (

    <div className=' py-2 px-4  rounded-lg md:flex  justify-between'>
      <div className=' flex-1 bg-white flex flex-col justify-start p-4 rounded-lg'>
        <h2 className='text-lg font-semibold text-slate-500'>
          Overall Attendance Performance
        </h2>
        <p className='font-bold text-4xl text-[#A9DFD8]'>{totalattendance + "%"}</p>
        <p className='font-semibold text-[#242942]'>
        </p>
        <div className='flex place-content-center h-fit my-auto mx-auto py-10' >
          <Progress className="flex-1 "
            theme={{
              success: {
                color: 'rgb(0, 204, 0)'
              },
              active: {
                color: '#fbc630'
              },
              default: {

                color: '#fbc630'
              }
            }}
            percent={totalattendance}
            type="circle"
          />
        </div>

      </div>


    </div>
  )
}



export default MGuagechart