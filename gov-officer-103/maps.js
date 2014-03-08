(function() {
  var infos = {}

  function initialize() {
    var mapOptions = {
      center: new google.maps.LatLng(25.046519, 121.517524),
      zoom: 13
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    var infowindow = new google.maps.InfoWindow({
      content: ""
    });

    $.each(data, function(index, d) {
      var l = d.geo_results[0].geometry.location;
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(l.lat, l.lng),
        map: map,
        animation: google.maps.Animation.DROP,
        title: d.name.trim()
      });
      google.maps.event.addListener(marker, 'click', function() {
        infowindow.content = marker.title
        infowindow.open(map, marker);
      });
      infos[d.name.trim()] = d;
      var a = $('<a></a>').attr('href', 'javascript:void(0)').text(d.name);
      var li = $('<li/>').html(a);
      a.mouseover(function() {
        $(this).parent().addClass('active');
        infowindow.content = marker.title;
        infowindow.open(map, marker);
      }).mouseout(function() {
        $(this).parent().removeClass('active');
        //infowindow.close();
      });
      a.click(function(){
        var info = infos[marker.title];
        infowindow.content = [
          "縣市：" + info.county,
          "名稱：" + info.name,
          "地址：" + info.address
        ].join("<br/>");
        infowindow.open(map, marker);
      });
      $('.list').append(li);
    });
  }
  google.maps.event.addDomListener(window, 'load', initialize);
})();
