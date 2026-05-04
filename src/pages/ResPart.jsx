import React from "react";
import { useRouter } from "next/router";


const ResPart = () => {



  const router = useRouter();
  const { subject } = router.query;
  


  return (
    <div className="overflow-y-auto h-full rounded-lg bg-indigo-50 p-4 pb-24 m-4">

    <a href={`./ResDocs?subject=${subject}`}>
      <div className="w-full py-8 text-xl text-slate-600 font-semibold drop-shadow-xl px-10 rounded-xl bg-white my-10 ">
        View Documents
      </div>
      </a>


      <a href={`./ResAssignments?subject=${subject}`}>

      <div className="w-full py-8 text-xl text-slate-600 font-semibold drop-shadow-xl px-10 rounded-xl bg-white my-10 ">
        View Assignments
      </div>

      </a>
    </div>

  );
};

export default ResPart;
