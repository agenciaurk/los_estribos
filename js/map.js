;(function ($, window, document, undefined) {
    $(document).ready(() => {
        //Este es el codigo del mapa.
        var settings = {"id":7839,"editor":{"selected_shape":"poly-8350","tool":"select","shapeCounter":{"polys":2}},"general":{"name":"losestribos","shortcode":"losestribos","width":1726,"height":2109,"naturalWidth":1726,"naturalHeight":2109,"center_image_map":1},"image":{"url":"images/previo.jpg"},"spots":[{"id":"poly-8350","title":"Poly 1","type":"poly","x":8.935,"y":13.646,"width":14.538,"height":11.105,"x_image_background":8.935,"y_image_background":13.646,"width_image_background":14.538,"height_image_background":11.105,"tooltip_content":{"squares_settings":{"containers":[{"id":"sq-container-377871","settings":{"elements":[{"settings":{"name":"Heading","iconClass":"fa fa-header"},"options":{"heading":{"text":"Disponible","heading":"h1"}}},{"settings":{"name":"Button","iconClass":"fa fa-link"},"options":{"button":{"text":"360°","link_to":"#3601","display":"block","bg_color":"#ffc069","text_color":"#000000","border_radius":0}}}]}}]}},"points":[{"x":7.901234567901231,"y":44.179894179894184},{"x":0,"y":76.45502645502643},{"x":54.320987654320994,"y":100},{"x":100,"y":54.497354497354486},{"x":65.92592592592595,"y":0}]}]}

        $('#image-map-pro-container').imageMapPro(settings);
        
        let mapContainer = document.querySelector(".map-container")
        mapContainer.style.width = "max-content"
        mapContainer.style.margin = "auto"
        //width: max-content;
        //margin: auto;
    });
})(jQuery, window, document);