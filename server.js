require ('dotenv').config()
const express=require("express")
const axios=require("axios")
const cors=require("cors")
const path=require('path')

const app=express()
app.use(cors())

app.use(express.static(path.join(__dirname, 'public')))

const API_KEY=process.env.API_KEY

app.get('/trending', async(req, res)=> {
    try {
        const response=await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
            params: {
                part: 'snippet,statistics',
                chart: 'mostPopular', 
                regionCode: 'IN', 
                maxResults: 10,
                key: API_KEY
            }
        })

        const videodata=response.data.items.map(item=> ({
            title: item.snippet.title,
            views: parseInt(item.statistics.viewCount),
            likes: parseInt(item.statistics.likeCount)
        }))

        const totalviews=videodata.reduce((sum, video)=> sum+video.views, 0)
        const avglikes=videodata.reduce((sum, video)=> sum+video.likes, 0)/ videodata.length

        res.json({totalviews, avglikes, videodata})
    } catch(error) {
        res.status(500).send("Error fetching videos")
    }
})

app.listen(5000, ()=> {
    console.log("Server running on localhost: port 5k")
})