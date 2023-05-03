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
const footer = document.querySelector( '#footer' );

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
    document.querySelector( "#msg" ).innerText = "";
    for ( e of document.querySelectorAll( ".mystyle" ) ) { e.remove(); }

    const q = inputBox.value;
    inputBox.value = "";

    let response = await axios.get( findMovieString( q ) );
    let movieList = response.data.results;

    if ( movieList.length === 0 ) { document.querySelector( "#msg" ).innerHTML = `Oops, it looks like we don't have ${ q } in our library yet. ☹️ <br> <br> But don't give up hope just yet! We're always adding new titles.😊`; };

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



        copyMovieContainer.querySelector( ".youtube_trailer_path" ).addEventListener( "click", async ( e ) =>
        {

            let iframeVideo = document.querySelector( "#iframe_video" );
            let videoID;
            try
            {
                videoID = response2.data.results[ 0 ].key;
                iframeVideo.src = youtubeEmbedLink( videoID ) + "?mute=1&autoplay=1";
                
                iframeVideo.style.display = "block";
                console.log( "from api: ", movieList[ i ].title, videoID );
            } catch ( e )
            {
                const searchUrl = `https://corsproxy.io/?https://www.youtube.com/results?search_query=${ movieList[ i ].title } ${ new Date( movieList[ i ].release_date ).getFullYear() } trailer`;
                try
                {
                    const response = await fetch( searchUrl );
                    const text = await response.text();
                    const match = text.match( /"videoId":"([^"]*)"/ );
                    videoID = match ? match[ 1 ] : null;
                    iframeVideo.src = youtubeEmbedLink( videoID ) + "?mute=1&autoplay=1";
                    iframeVideo.style.display = "block";
                    console.log( "from regex cors: ", movieList[ i ].title, videoID );
                } catch ( e )
                {
                    console.log( "here is an error", e );
                }
            }
        } );

        container.appendChild( copyMovieContainer );
    };
} );

document.addEventListener( "keydown", ( e ) =>
{
    if ( e.key === 'Escape' )
    {
        let player = document.querySelector( "#iframe_video" );
        player.src = "";
        player.style.display = "none";
    }
} );

document.querySelector( "#iframe_video" ).addEventListener( "keydown", ( e ) =>
{
    if ( e.key === 'Escape' )
    {
        let player = document.querySelector( "#iframe_video" );
        player.src = "";
        player.style.display = "none";
    }
} );

document.addEventListener( "click", ( e ) =>
{
    if ( !e.target.closest( "body *" ) )
    {
        let player = document.querySelector( "#iframe_video" );
        player.src = "";
        player.style.display = "none";
    }
} );


inputBox.addEventListener( "keypress", ( e ) =>
{
    if ( e.key === "Enter" )
    {
        if ( inputBox.value )
        {
            searchButton.click();
        }
    }
} );