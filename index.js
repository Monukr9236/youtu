const express=require('express');
const ytdl=require('ytdl-core');
const cors=require('cors');
const app=express();
app.use(cors());
app.use(express.json());


// function to generate link of a youtube video thambnail
async function getVideoInfo(videoId) {
    const videoInfo = await ytdl.getInfo(videoId);
    // Get the thumbnail URL
    const thumbnailUrl = videoInfo.videoDetails.thumbnails[0].url;
    const title = videoInfo.videoDetails.title;
    const channel = videoInfo.videoDetails.author.name;
    // videoInfo.videoDetails.thumbnail.thumbnails[0].url
    return {
        "status":200,
        "title":`${title}`,
         "channel":`${channel}`,
         "url":`${thumbnailUrl}`
    };
}

// function to generate link of a youtube video
async function generateDownloadLink(videoId) {
    const videoInfo = await ytdl.getInfo(videoId);
    const videoFormat = ytdl.chooseFormat(videoInfo.formats, { filter: 'audioandvideo',quality:"highest"});
    const downloadUrl = videoFormat.url;
    return downloadUrl;
  }

// api for generating download link
app.post('/api/download',async(req,resp)=>{
    const {videoId}=req.body;
    try {
        const url=await generateDownloadLink(videoId);
        if(url){
            return resp.json({message:"link generated",status:200,url:url});
        }
    } catch (error) {
        resp.json({status:500,message:"failed to generate link"});
    }

})

// api for getting thaimbnail of a video
app.post('/api/info',async(req,resp)=>{
    const {videoId}=req.body;
    try{
        const info=await getVideoInfo(videoId);
        resp.send(info);
    }catch(error){
        resp.json({status:500,message:"Please enter valid video id"});
    }
});

app.listen(8851,()=>{
    console.log("API is running on port 8851");
})

