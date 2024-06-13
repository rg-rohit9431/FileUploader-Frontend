import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import axios from 'axios';

//icons
import { IoCloudUploadOutline } from "react-icons/io5";
import { FaCopy } from "react-icons/fa6";

const App = () => {

  const [file, setFile] = useState(null);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (file) {
      fetchUrl();
    }
  }, [file]);

  const fetchUrl = async () => {
    const formData = new FormData();
    formData.append('image', file);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:8000/api/v1/upload',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    };

    try {
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
      setUrl(response.data.imageUrl); // Assuming the response contains the uploaded file URL
    } catch (error) {
      console.log(error);
    }
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  }

  const copyHandler = () => {
    if (url) {
      navigator.clipboard.writeText(url)
        .then(() => toast.success('Copied to clipboard'))
        .catch(err => console.error('Failed to copy text: ', err));
    } else {
      toast.error('No URL to copy');
    }
  }

  return (
    <div className='w-full h-[100vh] flex flex-col items-center justify-center '>
      <div className='relative flex items-center justify-center border-[3px]  border-dashed border-[#D2E3F4] w-[280px] h-[180px] sm:w-[600px] sm:h-[400px] rounded-md cursor-pointer'>
        <div className='flex flex-col items-center'>
          <IoCloudUploadOutline className='w-12 h-12 my-4 text-[#32424A]' />
          <p className='font-[700] font-mono text-[1.5rem] text-[#32424A]'> Click box to upload</p>

          {/* input file */}
          <input
            type="file"
            name='file'
            className='absolute top-0 w-full h-full opacity-0 cursor-pointer'
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* url form  */}
      {
        url && (
          <div className=' w-[280px] h-fit sm:w-[600px] border-2 mt-[1rem] p-[1rem] rounded-md flex items-center justify-between'>
            <span className='w-[95%] overflow-x-hidden text-nowrap text-ellipsis'>
              {url ? url : 'No file selected'}
            </span>
            <FaCopy onClick={copyHandler} className='text-[1.4rem] cursor-pointer' />
          </div>
        )
      }
    </div>
  )
}

export default App
