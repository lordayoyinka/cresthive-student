import React from 'react'
import foldericon from '../assests/foldericon.png'


const Documents = [
  {
    imageURL: foldericon,
    subject: "English Language: JSS1",
    code: "EGL12023"
  },
   {
    imageURL: foldericon,
    subject: "English Language: JSS2",
    code: "EGL12023"
  },
   {
    imageURL: foldericon,
    subject: "English Language: JSS3",
    code: "EGL12023"
  },
  {
    imageURL: foldericon,
    subject: "English Language: JSS1",
    code: "EGL12023"
  },
   {
    imageURL: foldericon,
    subject: "English Language: JSS2",
    code: "EGL12023"
  },
   {
    imageURL: foldericon,
    subject: "English Language: JSS3",
    code: "EGL12023"
  },

]
function FDocuments() {
  return (
    <div className = 'grid p-2 sm:grid-cols-2 md:grid-cols-3'>
          {Documents.map((document) => {
              return (
                  <div className = 'flex grow flex-col justify-center items-center  rounded-lg p-3 shadow-md'>
                      <a href="/RDocuments"><img src= {document.imageURL}  className = 'w-14 h-14' alt="" /></a> 
                      <div className = 'pt-3'>
                          <h2 className = 'font-semibold text-[#39623D]'>{document.subject}</h2>
                          <p className = 'text-[#646464]'>Code: {document.code}</p>
                      </div>  
                  </div>
              )
            
          })}

       
        </div>
  )
}

export default FDocuments