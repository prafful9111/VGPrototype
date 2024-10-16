const express = require('express');
const cors = require('cors');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.Port || 5000;

app.use(cors());
app.use(express.json());

app.post('/api/generate-video', (req, res) => {
  const { name, email, number, sms, wapp } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and Email are required" });
  }

  const templateVideo = path.join(__dirname, 'videos', 'template.mp4');
  const outputVideo = path.join(__dirname, `output.mp4`);

  // Check if template video exists
  if (!fs.existsSync(templateVideo)) {
    return res.status(404).json({ error: 'Template video not found' });
  }

  // Use FFmpeg command with text overlay, saving the output video
  ffmpeg(templateVideo)
  // .videoFilter(`drawtext=fontfile='fonts/arial.ttf':text='${name},${dob}':fontcolor=black:fontsize=48: enable='between(t,5,11)': x=(w-text_w)/2:y=(h-text_h)/2`)

  // .videoFilter(
  //   `drawtext=fontfile='fonts/arial.ttf':text='${name},${dob}':fontcolor=black:fontsize=48:` +
  //   `enable='between(t,5,11)':x=(w-text_w)/2:` +
  //   `y='(h-text_h)/2-(t-5)*30':`
  // )
  .videoFilter(
    //Name text overlay for name with fade-in effect
    `drawtext=fontfile='fonts/arial.ttf':text='${name}':fontcolor=black:fontsize=45:` +
    `enable='between(t,4.5,11.2)':` +
    `x=880:` +  // Fixed starting position 880 pixels from the left edge
    `y=200:` +  // Set Y position to 200 pixels
    `alpha='if(gte(t,4.5), if(lte(t,5.5), (t-4.5)/1, 1), 0)',` +  // Comma at the end to chain filters

    // Email text overlay for email
    `drawtext=fontfile='fonts/arial.ttf':text='${email}':fontcolor=black:fontsize=44:` +
    `enable='between(t,89,107.3)':` +  // Show from 89 to 107 seconds
    `x=790:` +                       // Fixed starting position 880 pixels from the left edge
    `y=222:` +                       // Set Y position to 300 pixels
    `alpha='if(gte(t,89), if(lte(t,90), (t-89)/1, 1), 0)',` +  // Fade in for email over 1 second

   // Number text overlay for Number 
   `drawtext=fontfile='fonts/arial.ttf':text='${number}':fontcolor=black:fontsize=44:` +
   `enable='between(t,102,107.3)':` +  
   `x=1010:` +                      
   `y=655:` +                       
   `alpha='if(gte(t,89), if(lte(t,90), (t-89)/1, 1), 0)',` + // Fade in for number over 1 second

   // SMS text overlay for Number 
   `drawtext=fontfile='fonts/arial.ttf':text='${sms}':fontcolor=black:fontsize=44:` +
   `enable='between(t,104,107.3)':` +  
   `x=1010:` +                      
   `y=800:` +                       
   `alpha='if(gte(t,89), if(lte(t,90), (t-89)/1, 1), 0)',` + // Fade in for number over 1 second

   // Whatsapp text overlay for Number 
   `drawtext=fontfile='fonts/arial.ttf':text='${wapp}':fontcolor=black:fontsize=44:` +
   `enable='between(t,106,107.3)':` +  
   `x=1010:` +                      
   `y=940:` +                       
   `alpha='if(gte(t,89), if(lte(t,90), (t-89)/1, 1), 0)'`  // Fade in for number over 1 second

  )
    .on('start', (commandLine) => {
      console.log('FFmpeg command:', commandLine);
    })
    .on('end', () => {
      console.log('Video generated successfully:', outputVideo);
      res.status(200).json({ videoPath: `output_${name}.mp4`});
    })
    .on('error', (err) => {
      console.error('Error generating video:', err);
      res.status(500).json({ error: 'Error generating video', details: err.message });
    })
    .save(outputVideo);
});


// New route for generating videos from Excel data
app.post('/api/generate-videos-from-excel', (req, res) => {
  const excelData = req.body.excelData;

  if (!excelData || !excelData.length) {
    return res.status(400).json({ error: "Excel data is required" });
  }

  const templateVideo = path.join(__dirname, 'videos', 'template.mp4');
  
  if (!fs.existsSync(templateVideo)) {
    return res.status(404).json({ error: 'Template video not found' });
  }

  excelData.forEach((row, index) => {
    const { Name: name, Email: email, Number: number, SMS: sms, Whatsapp: wapp } = row;

    const outputVideo = path.join(__dirname, `output_${name}_${index}.mp4`);

    // Generate video using FFmpeg for each row in the Excel file
    ffmpeg(templateVideo)
      .videoFilter(
        `drawtext=fontfile='fonts/arial.ttf':text='${name}':fontcolor=black:fontsize=45:` +
        `enable='between(t,4.5,11.2)':x=880:y=200:` +
        `alpha='if(gte(t,4.5), if(lte(t,5.5), (t-4.5)/1, 1), 0)',` +

        `drawtext=fontfile='fonts/arial.ttf':text='${email}':fontcolor=black:fontsize=44:` +
        `enable='between(t,89,107.3)':x=790:y=222:` +
        `alpha='if(gte(t,89), if(lte(t,90), (t-89)/1, 1), 0)',` +

        `drawtext=fontfile='fonts/arial.ttf':text='${number}':fontcolor=black:fontsize=44:` +
        `enable='between(t,102,107.3)':x=1010:y=655:` +
        `alpha='if(gte(t,89), if(lte(t,90), (t-89)/1, 1), 0)',` +

        `drawtext=fontfile='fonts/arial.ttf':text='${sms}':fontcolor=black:fontsize=44:` +
        `enable='between(t,104,107.3)':x=1010:y=800:` +
        `alpha='if(gte(t,89), if(lte(t,90), (t-89)/1, 1), 0)',` +

        `drawtext=fontfile='fonts/arial.ttf':text='${wapp}':fontcolor=black:fontsize=44:` +
        `enable='between(t,106,107.3)':x=1010:y=940:` +
        `alpha='if(gte(t,89), if(lte(t,90), (t-89)/1, 1), 0)'`
      )
      .on('start', (commandLine) => {
        console.log(`FFmpeg command for row ${index + 1}:`, commandLine);
      })
      .on('end', () => {
        console.log(`Video ${index + 1} generated successfully:`, outputVideo);
      })
      .on('error', (err) => {
        console.error(`Error generating video for row ${index + 1}:`, err.message);
      })
      .save(outputVideo);
  });

  res.status(200).json({message: "Videos are being generated from excel"});
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
