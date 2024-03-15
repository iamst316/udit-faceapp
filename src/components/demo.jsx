// import React, { useEffect, useRef } from 'react';
// import * as faceapi from 'face-api.js';

// const FaceRecognitionComponent = () => {
//     const videoHeight=480;
//    const videoWidth=640;

//   const videoRef = useRef(null);

//   useEffect(() => {
//     const startWebcam = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
//         videoRef.current.srcObject = stream;
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     const getLabeledFaceDescriptions = async () => {
//       const labels = ["Abhay", "Shubham", "Udit"];
//       const labeledFaceDescriptors = await Promise.all(
//         labels.map(async (label) => {
//           const descriptions = [];
//           for (let i = 1; i <= 2; i++) {
//             const img = await faceapi.fetchImage(`./labels/${label}/${i}.jpeg`);
//             const detections = await faceapi
//               .detectSingleFace(img)
//               .withFaceLandmarks()
//               .withFaceDescriptor()
//               .withFaceExpressions();
//             descriptions.push(detections.descriptor);
//           }
//           return new faceapi.LabeledFaceDescriptors(label, descriptions);
//         })
//       );
//       return labeledFaceDescriptors;
//     };

//     const setupFaceRecognition = async () => {
//       const labeledFaceDescriptors = await getLabeledFaceDescriptions();
//       const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

//       const canvas = faceapi.createCanvasFromMedia(videoRef.current);
//       document.body.append(canvas);

//       const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
//       faceapi.matchDimensions(canvas, displaySize);

//       setInterval(async () => {
//         const detections = await faceapi
//           .detectAllFaces(videoRef.current)
//           .withFaceLandmarks()
//           .withFaceDescriptors()
//           .withFaceExpressions();

//         const resizedDetections = faceapi.resizeResults(detections, displaySize);

//         canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
//         faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

//         function getDominantExpression(expressions) {
//           const maxProbability = Math.max(...Object.values(expressions));
//           return Object.keys(expressions).find((key) => expressions[key] === maxProbability);
//         }

//         const results = resizedDetections.map((d) => {
//           const expression = getDominantExpression(d.expressions);
//           return faceMatcher.findBestMatch(d.descriptor, 0.6).label + ` (${expression})`;
//         });

//         results.forEach((result, i) => {
//           const box = resizedDetections[i].detection.box;
//           const drawBox = new faceapi.draw.DrawBox(box, {
//             label: result,
//           });
//           drawBox.draw(canvas);
//         });
//       }, 100);
//     };

//     // Load faceapi models and start webcam once the component mounts
//     Promise.all([
//       faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
//       faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
//       faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
//       faceapi.nets.faceExpressionNet.loadFromUri("/models"),
//     ]).then(() => {
//       startWebcam();
//       setupFaceRecognition();
//     });

//     // Cleanup function
//     return () => {
//       if (videoRef.current) {
//         const stream = videoRef.current.srcObject;
//         const tracks = stream.getTracks();
//         tracks.forEach((track) => track.stop());
//       }
//     };
//   }, []); // Empty dependency array ensures the effect runs once when the component mounts

//   return (
//     <div>
//       <video ref={videoRef} autoPlay playsInline muted  height={videoHeight} width={videoWidth}/>
      
//     </div>
//   );
// };

// export default FaceRecognitionComponent;
