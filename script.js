const apiKey = "02a78a624aa5579cb06d2aee845b236b";



const inputBox = document.querySelector( "#inputBox" );
const searchButton = document.querySelector( "#searchButton" );
const container = document.querySelector( "#container" );
const movieContainer = document.querySelector( "#movieContainer" );
const title = document.querySelector( ".title" );
const original_title = document.querySelector( ".original_title" );
const overview = document.querySelector( ".overview" );
const poster_path = document.querySelector( ".poster_path" );
const release_date = document.querySelector( ".release_date" );
const original_langauge = document.querySelector( ".original_language" );
const youtube_trailer_path = document.querySelector( ".youtube_trailer_path" );

const findMovieString = ( q ) => { return `https://api.themoviedb.org/3/search/movie?api_key=${ apiKey }&query=${ q }`; };

const findTrailerString = ( id ) => { return `https://api.themoviedb.org/3/movie/${ id }/videos?api_key=${ apiKey }`; };

const youtubeLink = ( key ) => { return `https://www.youtube.com/watch?v=${ key }`; };

const youtubeEmbedLink = ( key ) => { return `https://www.youtube.com/embed/${ key }`; };

const langFullName = ( lang ) => { return ( langArray.find( ( e ) => { return e.iso_639_1 === lang; } ) ).english_name; };

const posterLink = ( poster_path ) => { return `https://image.tmdb.org/t/p/original${ [ poster_path ] }`; };


searchButton.addEventListener( "click", async ( event ) =>
{
    for ( e of document.querySelectorAll( ".mystyle" ) ) { e.remove(); }

    const q = inputBox.value;
    inputBox.value = "";

    let response = await axios.get( findMovieString( q ) );
    let movieList = response.data.results;

    for ( movie of movieList )
    {
        let response2 = await axios.get( findTrailerString( movie.id ) );
        const copyMovieContainer = movieContainer.cloneNode( true );
        copyMovieContainer.classList.add( "mystyle" );

        copyMovieContainer.querySelector( ".title" ).innerText = movie.title;
        copyMovieContainer.querySelector( ".original_title" ).innerText = movie.original_title;
        copyMovieContainer.querySelector( ".overview" ).innerText = movie.overview;
        copyMovieContainer.querySelector( ".poster_path" ).innerText = posterLink( movie.poster_path );
        copyMovieContainer.querySelector( ".release_date" ).innerText = new Date( movie.release_date ).getFullYear();
        copyMovieContainer.querySelector( ".original_language" ).innerText = langFullName( movie.original_language );


        try
        {
            copyMovieContainer.querySelector( ".youtube_trailer_path" ).innerText = youtubeLink( response2.data.results[ 0 ].key );
        } catch ( e )
        {
            copyMovieContainer.querySelector( ".youtube_trailer_path" ).innerText = "Not Available";
        }

        container.appendChild( copyMovieContainer );
    }


    // let response2 = await axios.get( findTrailerString( movieList[ 0 ].id ) );


    // title.innerText = movieList[ 0 ].title;
    // original_title.innerText = movieList[ 0 ].original_title;
    // overview.innerText = movieList[ 0 ].overview;
    // poster_path.innerText = posterLink( movieList[ 0 ].poster_path );
    // release_date.innerText = new Date( movieList[ 0 ].release_date ).getFullYear();
    // original_langauge.innerText = langFullName( movieList[ 0 ].original_language );

    // try
    // {
    //     youtube_trailer_path.innerText = youtubeLink( response2.data.results[ 0 ].key );
    // } catch ( e )
    // {
    //     youtube_trailer_path.innerText = "Not available";
    // }







    // console.log( response.data.results[0] );

    // console.log( `We have total ${ movieList.length } movies named ${ q }. Here they are: ` );

    // for ( movie of movieList )
    // {

    //     let response2 = await axios.get( findTrailerString( movie.id ) );

    //     try
    //     {
    //         console.log( movie.title, movie.id, youtubeLink( response2.data.results[ 0 ].key ), youtubeEmbedLink( response2.data.results[ 0 ].key ) );
    //     } catch ( error )
    //     {
    //         console.log( movie.title, movie.id, "Youtube key not exists" );
    //     }


    // }






} );
