import React from 'react';
import Pdficon from '../assests/Pdficon.png';
import Docicon from '../assests/Docicon.png';

const Resources = [
    {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
        Date:   12-18-2023,
        Duedate: 12-18-2023,
    },
     {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
        Date:   12-18-2023,
        Duedate: 12-18-2023,
    },
     {
        imageURL: Docicon,
        Subject: "Mathematical Methods",
        Date:   12-18-2023,
        Duedate: 12-18-2023,
    },
     {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
        Date:   12-18-2023,
        Duedate: 12-18-2023,
    },
     {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
        Date:   12-18-2023,
        Duedate: 12-18-2023,
    },
     {
        imageURL: Docicon,
        Subject: "Mathematical Methods",
        Date:   12-18-2023,
        Duedate: 12-18-2023,
    },
     {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
        Date:   12-18-2023,
        Duedate: 12-18-2023,
    },
    {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
        Date:   12-18-2023,
        Duedate: 12-18-2023,
    },
      {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
        Date:   12-18-2023,
        Duedate: 12-18-2023,
    },
     {
        imageURL: Docicon,
        Subject: "Mathematical Methods",
        Date:   12-18-2023,
        Duedate: 12-18-2023,
    },
     {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
        Date:   12-18-2023,
        Duedate: 12-18-2023,
    },
    {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
        Date:   12-18-2023,
        Duedate: 12-18-2023,
    },
     {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
        Date:   12-18-2023,
        Duedate: 12-18-2023,
    },
     {
        imageURL: Docicon,
        Subject: "Mathematical Methods",
        Date:   12-18-2023,
        Duedate: 12-18-2023,
    },
     {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
        Date:   12-18-2023,
        Duedate: 12-18-2023,
    },
    {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
        Date:   12-18-2023,
        Duedate: 12-18-2023,
    },
     {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
        Date:   12-18-2023,
        Duedate: 12-18-2023,
    },
     {
        imageURL: Docicon,
        Subject: "Mathematical Methods",
        Date:   12-18-2023,
        Duedate: 12-18-2023,
    },
     {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
        Date:   12-18-2023,
        Duedate: 12-18-2023,
    },
    {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
        Date:   12-18-2023,
        Duedate: 12-18-2023,
    },
]
function Assignments() {
    
  return (
    <div className=" overflow-y-auto h-full rounded-lg bg-indigo-50 py-4 px-4 m-4 pb-24">
        <div className = 'w-full p-3 bg-white lg:h-fit  rounded-lg'>
            <h2 className = 'font-bold text-xl text-[#6C6C6C]'>
            Assignments
            </h2>
            <div className = 'grid p-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
                {Resources.map((resource) => {
                    return (
                        <div className = 'flex grow flex-col justify-center items-center rounded-lg  p-3 shadow-md'>
                            <img src= {resource.imageURL}  className = 'w-16 h-16' alt="" />
                            <div className = 'pt-3'>
                                <h2 className = 'font-semibold text-[#39623D]'>{resource.Subject}</h2>
                                <p className = 'text-[#646464]'>Date: {resource.Date}</p>
                                <p className = 'font-semibold text-[#D81717]'>Due Date: {resource.Duedate}</p>
                            </div>  
                        </div>
                    )
                
                })}
            </div>
    </div>
    </div>
    
  )
}

export default Assignments