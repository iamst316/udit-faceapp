import React, { useEffect, useRef,useState } from 'react';
import * as faceapi from 'face-api.js';

import users from '../utils/users';
import User from './User'; 
import Unauthorized from './Unauthorized';
 import { useNavigate } from 'react-router-dom';
const FaceRecognitionComponent = () => {
  const videoRef = useRef();
  const canvasRef = useRef(null);
  const videoHeight=480;
  const videoWidth=640;
  // const [username,setusername]=useState()
  const [password,setpassword]=useState()
  const [labelname,setlabelname]=useState()
  const navigate = useNavigate();
  const [accArr,setaccArr]=useState();
  let arr=[];

  useEffect(() => {
    // Load face-api.js models
    Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      faceapi.nets.ageGenderNet.loadFromUri("/models"),
    ]).then(console.log("models loaded")).then(startWebcam);
  }, []); // Empty dependency array ensures useEffect runs only once when the component mounts

  const startWebcam = async () => {
    try {
      const video = videoRef.current;

      // Get webcam stream
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      video.srcObject = stream;

      
function getLabeledFaceDescriptions() {
    const labels = ["Abhay", "Shubham", "Udit","ShubhamSharma","Ajeet"];
    // const labels=["Abhay"]
    return Promise.all(
      labels.map(async (label) => {
        const descriptions = [];
        for (let i = 1; i <=10; i++) {
          const imgPath = `./labels/${label}/${i}.jpeg`;
          const img = await faceapi.fetchImage(imgPath);
          const detections = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor()
            .withFaceExpressions()
            .withAgeAndGender();
             
            if (detections) {
              descriptions.push(detections.descriptor);
            } else {
              console.log('No face detected in',imgPath);
            }


        }
        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      })
    );
  }   
     
           
  
  

  video.addEventListener("play", async () => {
    const labeledFaceDescriptors =await getLabeledFaceDescriptions()
   
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);
  
     canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(video);

  
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvasRef.current, displaySize);
  
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video)
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withFaceExpressions()
        .withAgeAndGender();
  
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
  
      const canvas = canvasRef.current;
     if (canvas) {
          const context = canvas.getContext("2d");
        if (context) {
         context.clearRect(0, 0, videoWidth, videoHeight);
       }
}
      // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

      function getDominantExpression(expressions) {
        const maxProbability = Math.max(...Object.values(expressions));
        return Object.keys(expressions).find((key) => expressions[key] === maxProbability);
    }
    
  
      const results = resizedDetections.map((d) => {
       
        const expression = getDominantExpression(d.expressions);
        const age=Math.round(d.age);
        const gender=d.gender;
        const label = d.descriptor ? faceMatcher.findBestMatch(d.descriptor, 0.9).label : "unknown";
        console.log(label)
        setlabelname(label)


         


  
        return `${label} (Age: ${age}, Gender: ${gender}, Expression: ${expression})`;
      });
      results.forEach((result, i) => {
        const box = resizedDetections[i].detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, {
          label: result,
        });
        drawBox.draw(canvasRef.current);
      });
    }, 100);
  });

     
    } catch (error) {
      console.error(error);
    }
  };

  const handleclick=()=>{

    console.log(labelname)
    const user = users.users.find((user) => user.username === labelname && user.password === password);

    if (user) {
      console.log("Password matched");
      navigate('/user');
    } else {
      console.log("User not found or password incorrect");
      navigate('/unauthorized');
    }

  }

  return (
    <div className='box' >



         <video ref={videoRef} autoPlay muted height={videoHeight} width={videoWidth}></video>
      <canvas ref={canvasRef} />

    
     <div>

        {/* <input type='text' placeholder='username' value={username} onChange={(e)=>{
            setusername(e.target.value)
        }} ></input> */}

        <input type='password' placeholder='password' value={password} onChange={(e)=>{
            setpassword(e.target.value)
        }} ></input>

        <button onClick={handleclick}>Click me!</button>

     </div>
        
        

    </div>
  );
};

export default FaceRecognitionComponent;


// import React, { useEffect, useRef, useState } from 'react';
// import * as faceapi from 'face-api.js';

// import users from '../utils/users';
// import User from './User'; 
// import Unauthorized from './Unauthorized';
// import { useNavigate } from 'react-router-dom';

// const FaceRecognitionComponent = () => {
//   const videoRef = useRef();
//   const canvasRef = useRef(null);
//   const videoHeight = 480;
//   const videoWidth = 640;
//   const [password, setpassword] = useState();
//   const [labelname, setlabelname] = useState();
//   const [labeledFaceDescriptors, setLabeledFaceDescriptors] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Load face-api.js models
//     Promise.all([
//       faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
//       faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
//       faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
//       faceapi.nets.faceExpressionNet.loadFromUri("/models"),
//       faceapi.nets.ageGenderNet.loadFromUri("/models"),
//     ]).then(() => {
//       console.log("models loaded");
//       getLabeledFaceDescriptions().then((descriptors) => {
//         console.log(`Descriptor:${descriptors}`)
//         setLabeledFaceDescriptors(descriptors);
//         startWebcam();
//       });
//     });
//   }, []); // Empty dependency array ensures useEffect runs only once when the component mounts

//     function getLabeledFaceDescriptions() {
//     const labels = ["Abhay", "Shubham", "Udit","ShubhamSharma","Ajeet"];
//     // const labels=["Abhay"]
//     return Promise.all(
//       labels.map(async (label) => {
//         const descriptions = [];
//         for (let i = 1; i <=10; i++) {
//           const imgPath = `./labels/${label}/${i}.jpeg`;
//           const img = await faceapi.fetchImage(imgPath);
//           const detections = await faceapi
//             .detectSingleFace(img)
//             .withFaceLandmarks()
//             .withFaceDescriptor()
//             .withFaceExpressions()
//             .withAgeAndGender();
             
//             if (detections) {
//               console.log(detections)
//               descriptions.push(detections.descriptor);
//             } else {
//               console.log('No face detected in',imgPath);
//             }


//         }
//         return new faceapi.LabeledFaceDescriptors(label, descriptions);
//       })
//     );
//   }

//   const startWebcam = async () => {
//     try {
//       const video = videoRef.current;

//       // Get webcam stream
//       const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
//       video.srcObject = stream;

//       video.addEventListener("play", async () => {
//         // console.log(labeledFaceDescriptors)
//         const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

//         canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(video);

//         const displaySize = { width: video.width, height: video.height };
//         faceapi.matchDimensions(canvasRef.current, displaySize);

//         setInterval(async () => {
//           const detections = await faceapi
//             .detectAllFaces(video)
//             .withFaceLandmarks()
//             .withFaceDescriptors()
//             .withFaceExpressions()
//             .withAgeAndGender();

//           const resizedDetections = faceapi.resizeResults(detections, displaySize);

//           const canvas = canvasRef.current;
//           if (canvas) {
//             const context = canvas.getContext("2d");
//             if (context) {
//               context.clearRect(0, 0, videoWidth, videoHeight);
//             }
//           }

//           function getDominantExpression(expressions) {
//             const maxProbability = Math.max(...Object.values(expressions));
//             return Object.keys(expressions).find((key) => expressions[key] === maxProbability);
//           }

//           const results = resizedDetections.map((d) => {
//             const expression = getDominantExpression(d.expressions);
//             const age = Math.round(d.age);
//             const gender = d.gender;
//             const label = d.descriptor ? faceMatcher.findBestMatch(d.descriptor, 0.9).label : "unknown";
//             console.log(label);
//             setlabelname(label);

//             return `${label} (Age: ${age}, Gender: ${gender}, Expression: ${expression})`;
//           });

//           results.forEach((result, i) => {
//             const box = resizedDetections[i].detection.box;
//             const drawBox = new faceapi.draw.DrawBox(box, {
//               label: result,
//             });
//             drawBox.draw(canvasRef.current);
//           });
//         }, 100);
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleclick = () => {
//     console.log(labelname);
//     const user = users.users.find((user) => user.username === labelname && user.password === password);

//     if (user) {
//       console.log("Password matched");
//       navigate('/user');
//     } else {
//       console.log("User not found or password incorrect");
//       navigate('/unauthorized');
//     }
//   };

//   return (
//     <div className='box'>
//       <video ref={videoRef} autoPlay muted height={videoHeight} width={videoWidth}></video>
//       <canvas ref={canvasRef} />
//       <div>
//         <input type='password' placeholder='password' value={password} onChange={(e) => setpassword(e.target.value)}></input>
//         <button onClick={handleclick}>Click me!</button>
//       </div>
//     </div>
//   );
// };

// export default FaceRecognitionComponent;
