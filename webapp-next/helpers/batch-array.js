function batchArray(data, batchSize, withPlaceholders=true) {
    const batched = data.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index/batchSize)
        
        if(!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [] // start a new chunk
        }
        
        resultArray[chunkIndex].push(item)
        
        return resultArray
    }, []);

    if (withPlaceholders) {
        while (batched[batched.length - 1].length < batchSize) {
            batched[batched.length - 1].push(null);
        }
    }

    return batched
}

module.exports = batchArray;