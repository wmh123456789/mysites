/* jshint worker:true */
/* global geomToBbox */

//this function gets the response that would be sent back to the client, before it is returns.
//the default is to run the `main` function unless a specific callback function name is specified

function main(msg){
    var status = msg.status,
        response = msg.response;

    if(response && response.features && status != "progress" && status != "error"){
        var features = response.features,
            len = features.length,
            boxes = [];
        /*response.fields.push({
            name: "BOUNDS",
            type: "esriFieldTypeSmallInteger"
        });*/
        while(len--){
            var feat = features[len];
            var bounds = geomToBbox(feat.geometry);
            var geom = {
                spatialReference: response.spatialReference,
                rings: [
                    [[bounds[0],bounds[1]], [bounds[0],bounds[3]], [bounds[2],bounds[3]], [bounds[2],bounds[1]], [bounds[0],bounds[1]]]
                ]
            };
            var box = {
                attributes: {
                    NAME: feat.attributes.NAME + " Bounds",
                    STATE_NAME: feat.attributes.STATE_NAME,
                    OBJECTID: 5000 + parseInt(feat.attributes.OBJECTID,10),
                    BOUNDS: 1
                },
                geometry: geom
            };
            boxes.push(box);
            feat.attributes.BOUNDS = 0;
        }
        response.features = features.concat(boxes);
    }
}