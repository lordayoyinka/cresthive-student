import ResSubjects from '../components/ResSubjects';

import { useState, useEffect } from "react";
import { auth2 } from "@/firebase/config";
import { getAuth } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore, getDocs, collection } from "firebase/firestore";
import Loading from '@/components/Loading';






function Profile() {
  const [loader, setloader] = useState(false);

  
  const year = localStorage.getItem("studentyear");
  const term = localStorage.getItem("studentterm");


  const db = getFirestore();



    const [user, setUser] = useState(null);

    const [totalattendance, settotalattendance] = useState();
    const [markedDates2, setMarkedDates] = useState([]); // Store marked dates
  

    const [profilepic, setprofilepic] = useState("");
    const [userdata, setuserdata] = useState([]);
    const [usedata, setusedata] = useState([]);


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
        if (userdata){

        try {
  
  
          // Replace 'classname' with your class name
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
              if(data.students.some((student)=> student.id === uid)){
                markedDates.push(doc.id);
  
              }
              
            }
          });
  
  
          console.log("checkdate", markedDates.length, markedDates2.length);
  
          const calculate = ((markedDates.length / markedDates2.length) * 100) ;
  
          settotalattendance( calculate + "%")
  
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
        if (userdata){
        try {
          // Replace 'classname' with your class name
          const classname =  userdata;
          console.log("show", classname, year, term)
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
    }
  
      fetchMarkedDates();
    }, [userdata]);
    
  
  
  



    useEffect(() => {
        // Use Firebase's onAuthStateChanged to listen for authentication state changes
        const unsubscribe =  onAuthStateChanged(auth2, (authUser) => {
          if (authUser) {
            setloader(true)

            // User is authenticated, set the user state
            setUser(authUser);
            setprofiledp(authUser.uid);
            fetchsubs(authUser.uid);

            setloader(false)

    
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
    


    const setprofiledp = async (uid)=> {
      
        const db = getFirestore();
    
        
    
        const docref = doc(db, year, term, "students", uid);
        const snapshot = await getDoc(docref);
    
    
        const data = snapshot.data();
        console.log(snapshot, "uid")
    
    
        setprofilepic(data.profilePicture);
        setuserdata(data.selectedClass);
        setusedata(data);
    
        
    
      }

      const [assignedsubjects, setAssignedSubjects] = useState([]);


      function fetchsubs(studentUid){

        const db = getFirestore();
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
            console.log("Data33", subjects);
          })
          .catch((error) => {
            console.error("Error fetching assigned subjects: ", error);
            alert("Error fetching assigned subjects")
          });
      }




  return (
    <div className=" overflow-y-auto h-full rounded-lg bg-indigo-50 md:p-4 p-2 m-2 md:m-4 pb-40 md:pb-40">
        <div className = 'bg-white flex flex-col rounded-b-xl h-fit'>

        <div className='h-32 rounded-t-xl bg-green-800'>

        </div>
            
                <img
                className="h-52 w-52 -mt-24 mx-auto md:mx-8 rounded-full m-8"
                        src={profilepic}
                        alt=""
                      />
            
            <div className = 'px-8 flex pb-8'>
                <div className='grow'>
                <h1 className = 'text-3xl font-bold pt-4 text-[#303972]'>{usedata.fullName || "loading..."} 
                </h1>
                <h3 className = 'text-lg font-semibold text-purple-900 mt-5'>Student</h3>      
                </div>

                <button className = 'h-fit my-auto text-white text-sm bg-[#428777] rounded-xl p-4 md:m-4 md:mt-6 '>View Reports</button>

                </div>
            <div className = 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-between gap-8 pt-2  p-8'>
               
                <div>
                    <h2 className = 'text-[#A098AE] text-xl mb-3'>Address:</h2>
                    <div className = 'flex items-center gap-4'>
                        <img src = "./Assets/homeicon.png" alt="addressicon"  />
                        <p className = 'text-[#303972] text-lg font-bold'>{usedata.presentAddress || "loading"}</p>
                    </div>
                </div>
                <div>
                    <h2 className = 'text-[#A098AE] text-xl mb-3'>Phone:</h2>
                    <div className = 'flex items-center gap-4'>
                        <img src = "./Assets/phone.png" alt="phoneicon"  />
                        <p className = 'text-[#303972] text-lg font-bold'>{usedata.phoneNumber || "loading"}</p>
                    </div>
                </div>
                <div>
                    <h2 className = 'text-[#A098AE] text-sm mb-3'>Email:</h2>
                    <div className = 'flex items-center gap-2'>
                        <img src = "./Assets/mail.png" alt="emailicon"  />
                        <p className = 'text-[#303972] md:text-lg '>{usedata.email || "loading"}</p>
                    </div>
                </div>
            </div>
        </div>
       <div className = 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-6 px-5'>
        <div className = 'flex grow items-center bg-[#FFEEE8] p-4 gap-3 '>
            <img src = "./Assets/playcircle.png" alt="" className = 'rounded-full w-16 h-16' />
            <div>
                <p className = 'text-2xl pb-2'>{assignedsubjects.length}</p>
                <p className = 'text-sm'>Enrolled Subject</p>
            </div>
        </div>
         <div className = 'flex grow items-center bg-[#EBEBFF] p-4 gap-3 '>
            <img src = "./Assets/CheckSquare.png" alt="" className = 'rounded-full w-16 h-16' />
            <div>
                <p className = 'text-2xl pb-2'>{totalattendance ? (totalattendance) : "0%"}</p>
                <p className = 'text-sm'>Attendance</p>
            </div>
        </div>
        <div className = 'flex grow items-center bg-[#E1F7E3] p-4 gap-3 '>
            <img src = {"./Assets/worldcup.png"} alt="" className = 'rounded-full w-16 h-16' />
            <div>
                <p className = 'text-2xl pb-2'>{userdata || "loading"}</p>
                <p className = 'text-sm'>Class</p>
            </div>
        </div>
        <div className = 'flex grow items-center bg-[#FFF2E5] p-4 gap-3  '>
            <img src = {"./Assets/users.png"} alt="" className = 'rounded-full w-16 h-16' />
            <div>
                <p className = 'text-2xl pb-2'>{term + " Term"}</p>
                <p className = 'text-sm'>Current Term</p>
            </div>
        </div>
       </div>
       <div className = 'p-2 px-4 text-3xl font-bold text-[#6C6C6C]'>
        Subjects
       </div>
        <ResSubjects />



        <div className="absolute top-0 left-0">
        <Loading newstate={loader} />
        </div>
    </div>
  )
}

export default Profile