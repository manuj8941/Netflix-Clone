const apiKey = "02a78a624aa5579cb06d2aee845b236b";



const inputBox = document.querySelector( "#inputBox" );
const searchButton = document.querySelector( "#searchButton" );
const container = document.querySelector( "#container" );
const movieContainer = document.querySelector( "#movie-card" );
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

const posterLink = ( poster_path ) => { return `https://image.tmdb.org/t/p/original${ poster_path }`; };

const x = [];

searchButton.addEventListener( "click", async ( event ) =>
{
    x.length = 0;
    for ( e of document.querySelectorAll( ".mystyle" ) ) { e.remove(); }

    const q = inputBox.value;
    inputBox.value = "";

    let response = await axios.get( findMovieString( q ) );
    let movieList = response.data.results;

    // console.log( movieList[ 0 ] );

    for ( let i = 0; i <= movieList.length; i++ )
    {


        let response2 = await axios.get( findTrailerString( movieList[ i ].id ) );
        const copyMovieContainer = movieContainer.cloneNode( true );
        copyMovieContainer.style.display = "flex";
        copyMovieContainer.classList.add( "mystyle" );

        copyMovieContainer.querySelector( ".title" ).innerText = movieList[ i ].title;
        copyMovieContainer.querySelector( ".original_title" ).innerText = movieList[ i ].original_title;


        x.push( true );

        if ( movieList[ i ].overview.length > 150 )
        {
            copyMovieContainer.querySelector( ".span1" ).innerText = `${ movieList[ i ].overview.slice( 0, 149 ) }`;
            copyMovieContainer.querySelector( ".span2" ).innerText = `   ...show more`;
        }
        else
        {
            copyMovieContainer.querySelector( ".span1" ).innerText = movieList[ i ].overview;
        }


        copyMovieContainer.querySelector( ".span2" ).addEventListener( "click", () =>
        {
            if ( x[ i ] === true )
            {

                copyMovieContainer.querySelector( ".span1" ).innerText = movieList[ i ].overview;
                copyMovieContainer.querySelector( ".span2" ).innerText = "   show less";
                x[ i ] = !x[ i ];
            } else 
            {
                copyMovieContainer.querySelector( ".span1" ).innerText = movieList[ i ].overview.slice( 0, 149 );
                copyMovieContainer.querySelector( ".span2" ).innerText = "   ...show more";
                x[ i ] = !x[ i ];
            }
        } );















        if ( movieList[ i ].poster_path ) { copyMovieContainer.querySelector( ".poster_path" ).src = posterLink( movieList[ i ].poster_path ); } else { copyMovieContainer.querySelector( ".poster_path" ).src = "blank.jpg"; }


        copyMovieContainer.querySelector( ".release_date" ).innerText = new Date( movieList[ i ].release_date ).getFullYear();
        copyMovieContainer.querySelector( ".original_language" ).innerText = langFullName( movieList[ i ].original_language );

        try
        {
            copyMovieContainer.querySelector( ".youtube_trailer_path" ).href = youtubeLink( response2.data.results[ 0 ].key );
        } catch ( e )
        {
            // const searchUrl = `https://cors-anywhere.herokuapp.com/https://www.youtube.com/results?search_query=${ movieList[ i ].title } ${ new Date( movieList[ i ].release_date ).getFullYear() } trailer`;
            const searchUrl = `https://corsproxy.io/?https://www.youtube.com/results?search_query=${ movieList[ i ].title } ${ new Date( movieList[ i ].release_date ).getFullYear() } trailer`;
            try
            {
                const response = await fetch( searchUrl );
                const text = await response.text();
                const match = text.match( /"videoId":"([^"]*)"/ );
                const videoId = match ? match[ 1 ] : null;
                const videoLink = videoId ? `https://www.youtube.com/watch?v=${ videoId }` : 'Not Available';
                copyMovieContainer.querySelector( ".youtube_trailer_path" ).href = videoLink;
            } catch ( e )
            {
                // console.error( 'Error searching YouTube:', e );
                copyMovieContainer.querySelector( ".youtube_trailer_path" ).style.visibility = "hidden";
            }




            // copyMovieContainer.querySelector( ".youtube_trailer_path" ).style.visibility = "hidden";







        }

        container.appendChild( copyMovieContainer );
    };

    


 


} );





