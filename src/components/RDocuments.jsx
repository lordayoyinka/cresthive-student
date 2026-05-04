import React from 'react'
import Pdficon from '../assests/Pdficon.png'
import Docicon from '../assests/Docicon.png'


const Resources = [
    {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
    },
     {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
    },
     {
        imageURL: Docicon,
        Subject: "Mathematical Methods",
    },
     {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
    },
     {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
    },
     {
        imageURL: Docicon,
        Subject: "Mathematical Methods",
    },
     {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
    },
    {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
    },
    {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
    },
    {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
    },
    {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
    },
    {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
    },
    {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
    },
    {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
    },
    {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
    },
    {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
    },
    {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
    },
    {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
    },
    {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
    },
    {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
    },
    {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
    },
    {
        imageURL: Pdficon,
        Subject: "Mathematical Methods",
    },
     
]
function Documents() {
    
  return (
    <div className=" overflow-y-auto h-full rounded-lg bg-indigo-50 py-4 px-4 m-4 pb-24">
        <div className='flex flex-col w-full p-3 bg-white lg:h-fit  rounded-lg'>
            <h2 className = 'font-bold text-xl text-[#6C6C6C]'>
                Documents
            </h2>
                <div className = 'grid p-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
                    {Resources.map((resource) => {
                        return (
                            <div className = 'flex grow flex-col justify-center items-center rounded-lg  p-3 shadow-md'>
                                <img src= {resource.imageURL}  className = 'w-16 h-16' alt="" />
                                <div className = 'pt-3'>
                                    <h2 className = 'font-semibold text-[#39623D]'>{resource.Subject}</h2>
                                </div>  
                            </div>
                        )
                    
                    })}
                </div>
        
        </div>
    </div>
    
  )
}

export default Documents