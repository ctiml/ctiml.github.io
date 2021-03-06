(function() {
  var infos = {}
  var current_marker = null;

  String.prototype.hashCode = function() {
    var hash = 0, i, char;
    if (this.length == 0) return hash;
    for (i = 0, l = this.length; i < l; i++) {
      char  = this.charCodeAt(i);
      hash  = ((hash<<5)-hash)+char;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };

  function intToARGB(i) {
    return ((i>>24)&0xFF).toString(16) +
      ((i>>16)&0xFF).toString(16) +
      ((i>>8)&0xFF).toString(16) +
      (i&0xFF).toString(16);
  }

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
      var l = d.geo_results.geometry.location;
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
      infos[d.id] = d;
      marker.id = d.id;
      var hash = d.county.hashCode();
      var color = intToARGB(hash).substr(0, 6);
      if (hash % 2 == 0) {
        color = color.split("").reverse().join("");
      }
      var span_tag = $('<span/>').addClass('county').text(d.county).css('background-color', "#" + color);
      var span_name = $('<span/>').addClass('name').text(d.name);
      var a = $('<a></a>').attr('href', 'javascript:void(0)').append(span_tag).append(span_name);
      var li = $('<li/>').html(a);
      a.mouseover(function() {
        $(this).parent().addClass('active').siblings().removeClass('active');
        if (current_marker != marker) {
          infowindow.close();
          infowindow.content = marker.title;
          infowindow.open(map, marker);
          current_marker = marker;
        }
      });
      a.click(function(){
        var info = infos[marker.id];
        infowindow.content = [
          $('<div/>').css({
            "font-weight":"bold",
            "display":"inline-block",
            "font-size":"16px",
            "padding":"3px 0px"
          }).text(info.name)[0].outerHTML,
          "縣　　市：" + info.county,
          "職　　缺：" + info.need_now,
          "是否現缺：" + (parseInt(info.has_need) == 1 ? "Yes" : "No"),
          "地　　址：" + info.address,
          "完整地址：" + info.geo_results.formatted_address,
          "工作內容：",
          info.works.join("<br/>")
        ].join("<br/>");
        infowindow.open(map, marker);
      });
      $('.list').append(li);
    });
  }
  google.maps.event.addDomListener(window, 'load', initialize);
})();
