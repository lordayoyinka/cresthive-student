import React, { useState, useEffect } from "react";
import {
  SearchIcon,
  SortAscendingIcon,
  ChevronDownIcon,
} from "@heroicons/react/solid";
import { Menu } from "@headlessui/react";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";

const ResDocs = () => {
  const [loader, setloader] = useState(false);


  
  const year = localStorage.getItem("studentyear");
  const term = localStorage.getItem("studentterm");

  const [documents, setDocuments] = useState([]);
  const [newDocumentName, setNewDocumentName] = useState("");
  const [selectedDocumentFile, setSelectedDocumentFile] = useState(null);
  const [isAddDocumentPopupOpen, setIsAddDocumentPopupOpen] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);

  const db = getFirestore();
  const storage = getStorage(); // Initialize Firebase Storage
  const storageRef = ref(storage, `documents`); // Change 'documents' to your storage path

  const router = useRouter();
  useEffect(() => {
    const { subject } = router.query;
    if (subject) {
      setSubjectName(subject);
    }
  }, [router.query]);

  useEffect(() => {
    // Load existing documents for the subject from Firestore
    const loadDocuments = async () => {
      setloader(true)

      console.log("trying to load");
      try {
        const q = collection(db, year, term, `subjects/${subjectName}/documents`); // Change 'documents' to your Firestore collection name;
        const querySnapshot = await getDocs(q);
        console.log("trying to load", querySnapshot);

        const documentList = [];
        querySnapshot.forEach((doc) => {
          documentList.push({ id: doc.id, ...doc.data() });
        });

        console.log("dl", documentList)
        setDocuments(documentList);
        setloader(false)

      } catch (error) {
        setloader(false)

        console.error("Error loading documents:", error);
        alert("Error loading documents!");
      }
    };

    loadDocuments();
  }, [db, subjectName]);

 

  const handleDocumentClick = (documentUrl) => {
    setSelectedDocument(documentUrl);
    console.log(selectedDocument);

  };

  return (
    <div className="overflow-y-auto flex-col flex h-full rounded-lg bg-indigo-50 p-4 pb-24 m-4">
      <div className="flex mb-6">
        

        <Menu as="div" className="relative">
          <Menu.Button className="w-full bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 inline-flex justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <SortAscendingIcon
              className="mr-3 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            Sort
            <ChevronDownIcon
              className="ml-2.5 -mr-1.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Menu.Button>
          <Menu.Items className="origin-top-right z-10 absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={`${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    } block px-4 py-2 text-sm`}
                  >
                    Name
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={`${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    } block px-4 py-2 text-sm`}
                  >
                    Date modified
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={`${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    } block px-4 py-2 text-sm`}
                  >
                    Date created
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      </div>
      <div></div>

      
      <div>
        <div className="mb-5 bg-white p-6 rounded-lg">
          <h2 className="font-semibold text-lg pb-4 opacity-50">
            All Documents for {subjectName}
          </h2>

          <ul
            role="list"
            className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-8"
          >
            {documents.map((documentitem) => (

              <li
              key={documentitem.email}
                className="w-full justify-self-start p-2 align-self-start flex-1 text-start bg-gray-50 rounded-lg shadow"
>
              <a

                
                onClick={() => handleDocumentClick(documentitem.downloadURL)}
                href={selectedDocument}


              >
               
                  <div className="flex-1 flex flex-col p-2">
                    <div className="flex justify-between">
                      <img
                        className="w-12 h-12 flex-shrink-0"
                        src={
                          documentitem.type === "word"
                            ? "/Assets/google-docs.png"
                            : "/Assets/pdf-file.png"
                        }
                        alt=""
                      />
                    </div>
                    <div className="flex-col">
                      <h3 className="mt-6 text-gray-900 font-medium">
                        {documentitem.name}
                      </h3>
                      <h3 className="text-red-900 place-content-bottom text-xs font-medium">
                        {documentitem.date}
                      </h3>
                    </div>
                  </div>
                <div></div>
              </a>
              </li>

            ))}
          </ul>
        </div>
      </div>

      {/* Button to open the Add Document popup */}
   
      {/* Add Document Popup */}
      {isAddDocumentPopupOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <p className="text-xl">Add New Document</p>
            <input
              type="text"
              placeholder="Document Name"
              value={newDocumentName}
              onChange={(e) => setNewDocumentName(e.target.value)}
              className="border p-2 my-2 w-full"
            />
            <input
              type="file"
              accept=".pdf, .doc, .docx"
              onChange={(e) => setSelectedDocumentFile(e.target.files[0])}
              className="border p-2 my-2 w-full"
            />
            <button
              onClick={handleAddDocument}
              className="bg-blue-500 text-white py-2 px-4 rounded mx-2"
            >
              Add Document
            </button>
            <button
              onClick={() => setIsAddDocumentPopupOpen(false)}
              className="bg-gray-500 text-white py-2 px-4 rounded mx-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

<div className="absolute top-0 left-0">
        <Loading newstate={loader} />
        </div>
    </div>
  );
};

export default ResDocs;
