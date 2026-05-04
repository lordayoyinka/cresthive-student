import React, {useState} from 'react'
import foldericon from '../assests/foldericon.png'
import FDocuments from './FDocuments'



const Lists = [
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
  


function Dresources() {
  const [showMore, setShowMore] = useState(false)
  return (
    <div className='flex flex-col'>
      {showMore ? <FDocuments />:
        <div className = 'grid p-2 sm:grid-cols-2 md:grid-cols-3'>
          {Lists.map((list) => {
              return (
                  <div className = 'flex grow flex-col justify-center items-center  rounded-lg p-3 shadow-md'>
                     <a href="/RDocuments"><img src= {list.imageURL}  className = 'w-14 h-14' alt="" /></a> 
                      <div className = 'pt-3'>
                          <h2 className = 'font-semibold text-[#39623D]'>{list.subject}</h2>
                          <p className = 'text-[#646464]'>Code: {list.code}</p>
                      </div>  
                  </div>
              )
            
          })}

       
        </div>
      }
      
    <button onClick={() => setShowMore(!showMore)} className = 'flex justify-end  p-4 font-bold text-[#39623D] w-full'>{showMore ? 'See less' : 'See more...'}</button>
  
  </div>
  )  
}

export default Dresources