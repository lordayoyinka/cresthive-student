"use client"; // This is a client component 👈🏽

import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import { useRouter } from 'next/router';
import { auth2 } from '@/firebase/config';
import { collection, doc, getDoc, getDocs, getFirestore } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';







const Activities = () => {
  
  const year = localStorage.getItem("studentyear");
  const term = localStorage.getItem("studentterm");


  const db = getFirestore();

  const calendarRef = useRef(null);
  const router = useRouter();
  const { classDocumentName } = router.query;
  const [markedDates, setMarkedDates] = useState([]); // Store marked dates

  const [user, setUser] = useState(null);
  const [userdata, setuserdata] = useState([]);


  useEffect(() => {
    // Use Firebase's onAuthStateChanged to listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth2, (authUser) => {
      if (authUser) {
        // User is authenticated, set the user state
        setUser(authUser);
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




  useEffect(()=>{
    const setclassname = async ()=> {
      const db = getFirestore();

      if(user){
  
      
      const docref = doc(db, year, term, "students", user.uid);
      const snapshot = await getDoc(docref);
  
  
      const data = snapshot.data();
      console.log(snapshot, "uid")
  
      if(data.selectedClass){
  
      setuserdata(data.selectedClass);
      }

    }
      
  
    }


    setclassname();
  },[user])
 






  useEffect(() => {
    // Fetch marked dates from the attendance collection
    const fetchMarkedDates = async () => {
      try {


        // Replace 'classname' with your class name
        const classnameset =  classDocumentName;
        const attendanceRef = collection(db, year, term, 'classes', userdata, 'Attendance');
        const markedDatesSnapshot = await getDocs(attendanceRef);
        const markedDates = [];

        console.log(markedDatesSnapshot, "dates")


        markedDatesSnapshot.forEach((doc) => {
          const data = doc.data();
          console.log(data, "data")


          const uid = user.uid;

          if(data && data.students){
            console.log(data.students, "students")
            if(data.students.some((student)=> student.id === uid)  ){

              const studentproto = data.students;
              studentproto.forEach(student => {

                if(student.id === uid && student.present === true){

                  markedDates.push(doc.id);

                }
                
              });


              



            }
            
          }
        });

        setMarkedDates(markedDates);
      } catch (error) {
        console.error('Error fetching marked dates:', error);
      }
    };

    fetchMarkedDates();
  }, [user, userdata]);

  // Create an events array dynamically from marked dates
  const events = markedDates.map((date) => ({
    title: 'Present',
    start: date,
    classNames: 'attendance-marked',
  }));


  console.log(auth2.currentUser, "whoever")


   
    
  return (


    <div className='overflow-y-auto h-full text-sm rounded-lg bg-indigo-50 py-4 px-4 m-4 pt-10 pb-24' >


<div className=" overflow-y-auto ">
         

      {/* <p className='py-6 text-2xl font-bold text-green-800'>{`${classDocumentName}`}</p> */}

      <FullCalendar
        ref={calendarRef}
        className=""
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridWeek"
        headerToolbar={{
          start: 'title',
          center: '',
          end: 'prev,next',
        }}
        events={events} // Pass the events data here
      />
    </div>
      


      
    </div>  

      
  

  )
}

export default Activities;