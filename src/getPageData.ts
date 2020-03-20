import request from "request"
import utils from "./utils"

const baseURL: string = "https://yande.re/post?"

function getPostByPageNum(baseURL: string, page: number, setCookie: string): Promise<object> {

    return new Promise<object>((resolve) => {

        page = (page > 0) ? page : 1

        const URL: string = baseURL + "&page=" + page
        const headers: object = utils.createHeaders(setCookie, page);

        request({
            method: "GET",
            uri: URL,
            headers: headers
        }, function(err: any, response: any, html: string) {
            if (err) return console.log(err)

            let result: Array<object> = []
    
            /**
             * Tách các row trong html thành một String Array.
             * lọc các đoạn "Post.register" và xử lý để chuyển về dạng JsonObject.  
             */
            html.split("\n")
                .forEach((row: string) => {
                    if (row.indexOf("Post.register(") > -1) {
                        let post = JSON.parse(
                                row.trim().slice("Post.register(".length, row.trim().length-1)
                            )
                        result.push(post)
                    }
                })

            resolve({setCookie: response.headers["set-cookie"], result})    
        })
    })
}

async function getPostData (tags: Array<string> = [], limit: number = 100,filter: any = {}, callback: Function) { // default value

    /* thêm tag vào url */
    const URL: string = baseURL + "&tags=" + tags.join("+")

    let count: number = 0
    let startPage: number = 1
    let setCookie: string = ""
    let thread: number = 20
    let result: Array<object> = [];

    (async function get(page: number, setCookie: string) {
        let arrayPromise: Promise<object>[] = []
        for (let i: number = page + 0; i < page + thread; ++i) {
            
            arrayPromise.push(getPostByPageNum(URL, i, setCookie))
        }

        let res:Array<object> = await Promise.all(arrayPromise);
        
        
        let lastPost: object = res[res.length-1]
        // @ts-ignore
        let newCookie = "vote=1; " + lastPost.setCookie.map(el => el.split("; ")[0]).join("; ")

        res.forEach((data: any) => {
        
            data= utils.filterPost(data.result, filter) 
            
            data.forEach((post: object) => {
                if (++count < limit) 
                    callback(post)
            })
        })
        
        if (count < limit)
            get(page+thread, newCookie)

    })(startPage, setCookie)

}

export = getPostData