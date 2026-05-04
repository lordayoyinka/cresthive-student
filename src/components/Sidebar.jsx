/* This example requires Tailwind CSS v2.0+ */
import {
  FolderIcon,
  HomeIcon,
  MailIcon,
  CogIcon,
  ServerIcon,
  ViewGridIcon,
  UsersIcon
} from "@heroicons/react/outline";
import { BellIcon } from "@heroicons/react/outline";
import { Menu } from "@headlessui/react";
import { useState, useEffect } from "react";
import { auth2 } from "@/firebase/config";
import { getAuth, signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useRouter } from "next/router";
import Loading from "./Loading";





const Sidebar = ({ children }) => {

  const router = useRouter();

  const [navigationstudent, setNavigation] = useState([
    { name: "Dashboard", icon: HomeIcon, href: "/", current: true },
    { name: "Resources", icon: ServerIcon, href: "/Resources", current: false },
    { name: "Activities", icon: ViewGridIcon, href: "/Activities", current: false },
    { name: "Messages", icon: MailIcon, href: "/Messages", current: false },
    { name: "Reports", icon: FolderIcon, href: "/Reports", current: false },
  ]);


  var year = localStorage.getItem("studentyear");
  var term = localStorage.getItem("studentterm");

  console.log("t n y", term, year);






  const iconMapping = {
    "Dashboard": HomeIcon,
    "Resources": ServerIcon,
    "Activities": ViewGridIcon,
    "Messages": MailIcon,
    "Reports": FolderIcon,
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  useEffect(() => {
    // Load navigation from localStorage when the component mounts
    const storedNavigationstudent =
      JSON.parse(localStorage.getItem("navigationstudent")) || navigationstudent;
    setNavigation(storedNavigationstudent);
    console.log(storedNavigationstudent, "storedNavigationstudent");
  }, []);


  useEffect(() => {
    console.log(navigationstudent);

  }, [navigationstudent]);

  const toggleCurrentStatus = (name) => {
    const updatedNavigation = navigationstudent.map((item) => ({
      ...item,
      current: item.name === name,
    }));
    setNavigation(updatedNavigation);

    // Save the updated navigation to localStorage
    localStorage.setItem("navigationstudent", JSON.stringify(updatedNavigation));
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const [user, setUser] = useState(null);
  const [profilepic, setprofilepic] = useState("");

  if (user) {
    const userid = user.uid;
  }

  useEffect(() => {
    // Use Firebase's onAuthStateChanged to listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth2, (authUser) => {
      if (authUser) {
        // User is authenticated, set the user state
        setUser(authUser);
        setprofiledp(authUser.uid);

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

 




  const setprofiledp = async (uid) => {
    const db = getFirestore();



    const docref = doc(db, year, term, "students", uid);
    const snapshot = await getDoc(docref);


    const data = snapshot.data();
    console.log(snapshot, "uid")

    if (data && data.profilePicture) {
      setprofilepic(data.profilePicture);

    }


  }

  function NavigateToProRfile() {
    const profileUrl = `/TeacherProfilePage?teacherId=${user.uid}`;
    window.location.href = profileUrl;
  }



    if(!year || !term ){

      signOut(auth2);

    }

  

  // Log out of Firebase
  const handleLogout = async () => {
    console.log("s o")

    const auth = getAuth();
    console.log("signing out")

    await signOut(auth2);

    console.log("signed out")
    // Remove user data from the browser
    localStorage.removeItem("navigationstudent");

    // Redirect or perform any additional actions as needed

    router.push("/")
  };


  const handleGoBack = ()=>{
    router.back();
  }




  const [toggleon, setToggleOn] = useState(false);

  return (
    <div className="fixed text-slate-900 bg-white flex w-full h-screen">
      <div className="absolute m-5 md:hidden">
        <p onClick={() => setToggleOn(true)}>Menu</p>
      </div>

      <div className={toggleon === false ? "hidden" : ""}>
        <div className="absolute z-50 bg-[#39623D] w-5/6 h-screen h-screen flex-col border-r border-gray-200 pt-2 pb-4 ">
          <div className="flex justify-end px-4 text-2xl text-white w-full">
            <div onClick={() => setToggleOn(false)} className="justify-end">
              {" "}
              x{" "}
            </div>
          </div>

          <div className="mx-auto flex align-items-center m-2 w-fit ">
            <a href="https://crestscholars.com">
              <img
                className="w-10 p-1 mx-auto h-10 rounded-full bg-white"
                src="./Assets/logo.png"
              />
            </a>

            <p className="align-self-center pb-5 text-lg font-semibold text-white mx-6 mt-3 ">
              {" "}
              Crest<span className="text-amber-500">hive</span>
            </p>
          </div>

          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2  space-y-1" aria-label="Sidebar">
              {navigationstudent.map((item) => {
                const IconComponent = iconMapping[item.name];

                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => toggleCurrentStatus(item.name)}
                    className={classNames(
                      item.current
                        ? "bg-gray-100 text-gray-900"
                        : "text-white hover:bg-gray-50 hover:text-gray-600",
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md "
                    )}
                  >
                    {IconComponent && (
                      <IconComponent
                        className={`mr-3 flex-shrink-0 h-6 w-6 ${item.current
                            ? "text-gray-500"
                            : "text-gray-400 group-hover:text-gray-500"
                          }`}
                        aria-hidden="true"
                      />
                    )}

                    <span className="flex-1 /flex">{item.name}</span>
                  </a>
                );
              })}
            </nav>
          </div>

          <div className="h-80 w-full flex items-end">

            <div onClick={() => handleLogout()} className="bg-orange-500 text-white text-lg w-full font-semibold justify-center text-center rounded-xl h-fit p-4 m-4 mb-8 ">
              <p  >Log out</p>
            </div>

          </div>


        </div>
      </div>

      <div className="hidden lg:flex md:flex bg-[#39623D] w-1/6 flex-col border-r border-gray-200 pt-5 pb-4 ">
        <div className="m-2 ">

          <a href="www.crestscholars.com">
            <img
              className="w-10 mx-auto p-1 h-10 rounded-full bg-white"
              src="/Assets/logo.png"
            />
          </a>

          <p className="pb-5 text-lg font-bold text-white w-fit mx-auto mt-4 ">
            Crest<span className="text-orange-200">Hive</span>
          </p>
        </div>

        <div className="mt-5 flex-grow flex flex-col">
          <nav className="flex-1 px-2  space-y-1" aria-label="Sidebar">
            {navigationstudent.map((item) => {
              const IconComponent = iconMapping[item.name];

              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => toggleCurrentStatus(item.name)}
                  className={classNames(
                    item.current
                      ? "bg-gray-100 text-gray-900"
                      : "text-white hover:bg-gray-50 hover:text-gray-600",
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md "
                  )}
                >
                  {IconComponent && (
                    <IconComponent
                      className={`mr-3 flex-shrink-0 h-6 w-6 ${item.current
                          ? "text-gray-500"
                          : "text-white group-hover:text-gray-500"
                        }`}
                      aria-hidden="true"
                    />
                  )}

                  <span className="flex-1 /flex">{item.name}</span>
                </a>
              );
            })}
          </nav>
        </div>

        <div className="h-80 w-full flex items-end">

          <div onClick={() => handleLogout()} className="bg-orange-500 text-white w-full font-semibold justify-center text-center rounded-xl h-fit py-3 m-4 mb-8 ">
            <p >Log out</p>
          </div>

        </div>
      </div>

      {/* Content area */}

      <div className="flex-grow-col w-full h-full overscroll-y-auto overflow-x-none">
      <div className="flex p-4 items-center justify-end md:justify-between  flex-grow bg-white ">
        <div className="hidden md:flex">
            <p onClick={handleGoBack} className="rounded-2xl px-4 py-2 text-white bg-green-700"> 
              ← Go back
            </p>
          </div>

          <div className="space-x-4 flex">
          <button
            type="button"
            className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <a href="./Notifications">
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </a>
          </button>

          {/* Profile dropdown */}
          <Menu as="div" className="ml-3 relative">
            <div>
              <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span className="sr-only">Open user menu</span>
                <a href="./Profile">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={`${profilepic}`}
                    alt=""
                  />
                </a>

              </Menu.Button>
            </div>
          </Menu>

          </div>
        </div>

        <div className="overscroll-y-auto h-full text-black">

          {children}

        </div>
      </div>

      
      
    </div>
  );
};

export default Sidebar;