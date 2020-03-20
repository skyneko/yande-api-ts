interface Filter {
    tags: Array<string>
    score: number
    fileSize: number
    width: number
    height: number
    hasChildren: boolean
    rating: string
}

export = {
    createHeaders: function (cookie: string = "", page: number): object {
        return {
            'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:72.0) Gecko/20100101 Firefox/72.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Referer': 'https://yande.re/post?page=' + (page - 1),
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cookie': cookie
        }
    },

    /**
     * Filter cho post Object
     * @param {Object} filter
     * + {Array} filter.tags : loại bỏ các post không có tag này
     * + {Int} filter.score : lọc post có score nhỏ hơn
     * + {Int} filter.fileSize : lọc filesize bé hơn 
     * + {Int} filter.width: lọc width bé hơn
     * + {Int} filter.height: lọc height bé hơn  
     * + {Boolean} filter.has_children
     * + {Char} filter.rating 
     * @param {Array} postArray
     * @return {Array}
     */
    filterPost: function (postArray: Array<object>, filter: Filter) {

        let result = postArray.map((post: any) => {

            /* filter by tag */
            if (filter.tags !== [] && filter.tags !== undefined) {

                for (let i = 0; i < filter.tags.length; ++i) {
                    if (post.tags.split(" ").includes(filter.tags[i]))
                        return;
                }
            }

            /* filter by score */
            if (filter.score !== undefined && filter.score > post.score) return;

            /* filter by filesize */
            if (filter.fileSize !== undefined && filter.fileSize > post.file_size) return;

            /* filter by width */
            if (filter.width !== undefined && filter.width > post.width) return;

            /* filter by height */
            if (filter.height !== undefined && filter.height > post.height) return;

            /* filter by children */
            if (filter.hasChildren !== undefined && filter.hasChildren !== post.has_children) return;

            /* filter by rating */
            if (filter.rating !== undefined && filter.rating !== post.rating) return;

            return post
        })

        /* loại bỏ các phần tử undefined */
        result = result.filter((el:unknown) => el != null);

        return result
    }
}