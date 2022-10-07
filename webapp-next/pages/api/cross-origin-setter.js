import axios from "axios";

export default async function handler(req, res) {
    const { url } = req.query;
    console.log('setting cors on request')

    const newReq = { ...req };
    delete newReq.body
    delete newReq.headers.cookie

    const urlOrigin = new URL(url).origin

    const request = new Request(url, newReq)
    request.headers.set('host', urlOrigin.split('https://instagram.')[1].split('/v/')[0])
    request.headers.set('Origin', urlOrigin)
    request.headers.set('sec-fetch-site', 'none')
    request.headers.set('sec-fetch-mode', 'navigate')
    request.headers.set('sec-fetch-dest', 'document')
    request.headers.set('accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9')
    request.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    // request.headers.set('Access-Control-Allow-Origin', '*')
    // request.headers.set('Access-Control-Allow-Credentials', true)
    // request.headers.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')

    console.log(request)
    console.log(request.headers)

    const response = await fetch(request)
    const data = await response.text()

    console.log('response')
    console.log(response)
    console.log(response.headers)
    console.log(data)
    res.status(200).send(response)    
    return

    try {
        const response = await axios.get(
            url,
            {
                headers: {
                    'Origin': new URL(url).origin,
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
            }
        );

        console.log(response);
        res.status(200).send(response.data);
    } catch (err) {
        console.log(err)
        console.log(err.response.data.errors)
    }
}