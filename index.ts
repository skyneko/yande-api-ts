import getPost from "./src/getPageData"

interface Post {
    id : number
}

const limit = 10000 // limit post 
const tags = ["nipples"] // require tag

let filter = {
    tags: ["kimono"], 
    score: 100,
    fileSize: 0,
    width: 3000, // minimum width and height
    height: 2000,
    hasChildren: false,
    rating: "q"
}

getPost(tags, limit, filter, (post: Post) => {
    console.log("https://yande.re/post/show/"+post.id)
})