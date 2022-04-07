import { useEffect, useState, useCallback } from "react";




const UseFetch = ({keyword}) => {
    const API_KEY = process.env.GIF_KEY
    const [gitUrl, setGifUrl] = useState("");

    console.log(API_KEY)

    const fetchGifs = useCallback((async () => {
        try {
            const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=HDYO1A7wDdKvomI47BIEMPiqRwPMbse9&q=${keyword.split(" ").join("")}&limit=1`);
            const { data } = await response.json();

            setGifUrl(data[0]?.images?.downsized_medium.url);
        } catch (error) {
            setGifUrl("https://metro.co.uk/wp-content/uploads/2015/05/pokemon_crying.gif?quality=90&strip=all&zoom=1&resize=500%2C284");
        }
    }), [keyword]);

    useEffect(() => {
        if(keyword) fetchGifs();
    }, [keyword, fetchGifs]);

    return gitUrl;
}

export default UseFetch;