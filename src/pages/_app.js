// pages/_app.js or pages/_app.tsx
import '@/app/globals.css';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth2 } from '@/firebase/config';
import Sidebar from '@/components/Sidebar';
import OnboardHolder from './OnboardHolder';
import SignIn from "./SignIn";
import RegistrationPage from "./RegistrationPage";
import { useRouter } from 'next/router';


function MyApp({ Component, pageProps, pageProps2 }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth2, (authUser) => {
      if (authUser && authUser.uid !== 'default') {
        setUser(authUser);
      } else {
        setUser(null);
      }

      setLoading(false); // Set loading to false after determining the user
    });

    return () => unsubscribe();
  }, []);


  if (loading) {
    return <div className='flex justify-center h-screen items-center'>Loading...</div>;
  }


   // Check if the user is not logged in and the route is /RegistrationPage
   const isRegistrationPage = !user && router.pathname === '/RegistrationPage';


  return (
    <div className="flex w-full bg-white text-slate-700">
      {user && user.uid !== 'default' ? (
        <Sidebar>
          <Component {...pageProps} user={user} />
        </Sidebar>
      ) : (
        isRegistrationPage ? <RegistrationPage /> : <SignIn />
      )}
    </div>
  );
}

export default MyApp;
