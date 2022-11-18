export function uniqByKeepFirst(a, key) {
    let seen = new Set();
    return a.filter(item => {
        let k = key(item);
        return seen.has(k) ? false : seen.add(k);
    });
}

export function uniqByKeepLast(a, key) {
    return [
        ...new Map(
            a.map(x => [key(x), x])
        ).values()
    ]
}

export function chunkArray(arr,n){
    var chunkLength = Math.max(arr.length/n ,1);
    var chunks = [];
    for (var i = 0; i < n; i++) {
        if(chunkLength*(i+1)<=arr.length)chunks.push(arr.slice(chunkLength*i, chunkLength*(i+1)));
    }
    return chunks; 
}