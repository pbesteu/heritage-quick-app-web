
const myPosition = { lat: 0, lon: 0};

(function($){
  $(function(){
    $('.sidenav').sidenav();
    $('.modal').modal({dismissible:false});
    $('.tabs').tabs();

    if ('geolocation' in navigator) {
      $('#modalinit').modal('open');
      navigator.geolocation.getCurrentPosition((position) => {
        $('#modalinit').modal('close');
        // console.log(position.coords.latitude + " " + position.coords.longitude);
        myPosition.lat = position.coords.latitude;
        myPosition.lon = position.coords.longitude
        updateDistancePoIs();
      });
    } else {
      /* geolocation IS NOT available */
      console.error('geolocation IS NOT available')
    }

    // Opens the dialog by default
    if (modalToOpenAtInit) {
      $(`#modal_${modalToOpenAtInit}`).modal('open');
    }
    
  }); // end of document ready

  /**
   * Converts the meters into a more friendly string (in metres or kms)
   * @param {integer} value with the distance in metres 
   * @returns a string with the value in human-readable format (metres, or kms)
   */
  function prettifyDistance(value) { 
    try {
      const number = parseInt(value);
      if (number > 1000) {
        return `${(value/1000).toFixed(2)} Km.`;        
      }
    } catch (ex) {
      return ''
    }
    return `${value} m.`;        
  }

  function updateDistancePoIs() {
    $('.card-distance-value').each((index, obj) => {
      const distance = window.geolib.getDistance(
        { latitude: myPosition.lat, longitude: myPosition.lon },
        { 
          latitude: obj.getAttribute('data-lat'),
          longitude: obj.getAttribute('data-lon') 
        }
      );
      $(obj).text(`${prettifyDistance(distance)}`);
    });
  }

})(jQuery); // end of jQuery name space

