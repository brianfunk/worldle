
//*********************************************************************************

var targetList = [
{
    coordinate: [2.2945, 48.858222],
    title: 'The Eiffel Tower',
    text: 'The <span class="redacted" id="hint-0">Eiffel Tower</span> is a <span class="redacted" id="hint-7">wrought-iron lattice tower</span> on the <span class="redacted" id="hint-3">Champ de Mars</span> in <span class="redacted" id="hint-1">Paris, France</span>. Locally nicknamed <span class="redacted" id="hint-10">"La dame de fer"</span>, it was constructed from <span class="redacted" id="hint-5">1887 to 1889</span> as the centerpiece of <span class="redacted" id="hint-6">the World\'s Fair</span>. The <span class="redacted" id="hint-4">tower</span> is <span class="redacted" id="hint-9">324 meters tall</span>, about the same as an <span class="redacted" id="hint-11">81-story building</span>, and the <span class="redacted" id="hint-8">tallest structure</span> in <span class="redacted" id="hint-2">Paris</span>.'
},
{
    coordinate: [116.397925, 39.915987],
    title: 'Forbidden City',
    text: 'The <span class="redacted" id="hint-0">Forbidden City</span> is a <span class="redacted" id="hint-13">palace complex</span> in <span class="redacted" id="hint-7">Dongcheng District</span> at the center of the <span class="redacted" id="hint-1">Imperial City of Beijing</span>. The <span class="redacted" id="hint-5">imperial palace</span> was constructed <span class="redacted" id="hint-16">from 1406 to 1420</span>, and was the <span class="redacted" id="hint-3">former residence</span> of the <span class="redacted" id="hint-11">Emperor of China</span> from <span class="redacted" id="hint-4">the Ming dynasty</span> to the end of <span class="redacted" id="hint-12">the Qing dynasty</span>. It served as the <span class="redacted" id="hint-2">home of Chinese emperors</span> and was the <span class="redacted" id="hint-15">ceremonial and political</span> center of the <span class="redacted" id="hint-10">Chinese government</span> for over <span class="redacted" id="hint-8">500 years</span>. The complex consists of <span class="redacted" id="hint-6">980 buildings</span>, encompassing <span class="redacted" id="hint-14">8,886 rooms</span> and covering <span class="redacted" id="hint-9">720,000 square metres</span>.'
},
{
    coordinate: [-77.0365, 38.8977],
    title: 'The White House',
    text: 'The <span class="redacted" id="hint-0">White House</span> is the official <span class="redacted" id="hint-15">residence and workplace</span> of the <span class="redacted" id="hint-4">president of the United States</span>. It is located at <span class="redacted" id="hint-1">1600 Pennsylvania Avenue NW</span> in <span class="redacted" id="hint-7">Washington, D.C.</span>, and has been <span class="redacted" id="hint-14">the residence</span> of every <span class="redacted" id="hint-3">U.S. president</span> since <span class="redacted" id="hint-2">John Adams</span> in <span class="redacted" id="hint-10">1800</span>. The property is <span class="redacted" id="hint-6">a National Heritage Site</span> owned by <span class="redacted" id="hint-12">the National Park Service</span> and is part of the <span class="redacted" id="hint-5">President\'s Park</span>. During <span class="redacted" id="hint-9">the War of 1812</span>, the <span class="redacted" id="hint-13">mansion</span> was <span class="redacted" id="hint-11">set ablaze</span> by the <span class="redacted" id="hint-8">British Army</span>.'
},
{
    coordinate: [-77.050139, 38.889278],
    title: 'Lincoln Memorial',
    text: 'The <span class="redacted" id="hint-0">Lincoln Memorial</span> is a <span class="redacted" id="hint-4">national memorial</span> dedicated <span class="redacted" id="hint-5">in May 1922</span> to honor the <span class="redacted" id="hint-9">16th president of the U.S</span>. It is on the <span class="redacted" id="hint-11">western end</span> of the <span class="redacted" id="hint-1">National Mall</span> in <span class="redacted" id="hint-2">Washington, D.C.</span>, across from the <span class="redacted" id="hint-7">Washington Monument</span>, and is in the form of a <span class="redacted" id="hint-6">neoclassical temple</span>. It has always <span class="redacted" id="hint-12">been a major tourist attraction</span> and has been the site of many <span class="redacted" id="hint-10">famous speeches</span> including <span class="redacted" id="hint-3"> "I have a Dream"</span> by <span class="redacted" id="hint-8">Martin Luther King Jr</span>.'
},
{
    coordinate: [-117.92, 33.81],
    title: 'Disneyland Park',
    text: 'The <span class="redacted" id="hint-0">Disneyland Park</span> is a <span class="redacted" id="hint-6">theme park</span> in <span class="redacted" id="hint-1">Anaheim, California</span>, opened on <span class="redacted" id="hint-5">July 17, 1955</span>. <span class="redacted" id="hint-3">Walt Disney</span> came up <span class="redacted" id="hint-11">with the concept</span> after visiting <span class="redacted" id="hint-8">various amusement parks</span> with <span class="redacted" id="hint-12">his daughters</span> in the <span class="redacted" id="hint-13">1930s and 1940s</span>. Since its opening, it has <span class="redacted" id="hint-9">undergone expansions</span> including <span class="redacted" id="hint-2">Mickey\'s Toontown</span> and <span class="redacted" id="hint-7">Star Wars: Galaxy\'s Edge</span>. It has a <span class="redacted" id="hint-14">larger cumulative attendance</span> than any other <span class="redacted" id="hint-4">theme park</span> in the world, with over <span class="redacted" id="hint-10">800 million visits</span> since it opened.'
},
{
    coordinate: [-73.552, 45.558],
    title: "Olympic Stadium",
    text: '<span class="redacted" id="hint-0">Olympic Stadium</span> is a <span class="redacted" id="hint-8">multi-purpose stadium</span> in <span class="redacted" id="hint-1">Montreal, Canada</span>, located at <span class="redacted" id="hint-9">Olympic Park</span> in the <span class="redacted" id="hint-4">Hochelaga-Maisonneuve district</span>. Built in the <span class="redacted" id="hint-7">mid-1970s</span> as the <span class="redacted" id="hint-16">main venue</span> for the <span class="redacted" id="hint-5">1976 Summer Olympics</span>, it is nicknamed <span class="redacted" id="hint-10">"The Big O"</span>. The <span class="redacted" id="hint-2">Montreal Tower</span> next to the <span class="redacted" id="hint-15">stadium</span> is the <span class="redacted" id="hint-17">tallest inclined tower</span> in the world with an <span class="redacted" id="hint-12">angle elevation of 45 degrees</span>. The <span class="redacted" id="hint-13">stadium</span> is the <span class="redacted" id="hint-18">largest by seating capacity</span> in <span class="redacted" id="hint-3">Canada</span> but has not had a <span class="redacted" id="hint-11">main tenant</span> since the <span class="redacted" id="hint-6">Expos left</span> in <span class="redacted" id="hint-14">2004</span>.'
},
];

//*********************************************************************************

var randomTarget = Math.floor(Math.random() * targetList.length);
//var randomTarget = 5;

var targetCoordinate = targetList[randomTarget].coordinate;
var targetTitle = targetList[randomTarget].title;
var targetText = targetList[randomTarget].text;
document.getElementById("desc").innerHTML = targetText;

var distanceTraveled = 0;
var areaScanned = 0;
var previousCoordinate = false;

var zoomLevel;
var roundLevel = 0;

var clickArray = [];
var trackArray = [];

var distanceRadius = 2500000;
var maxRadius = 5000000

var redCircleArray = [];
var smallestCircle = false;

var hintCount = $('.redacted').length;
console.log('hintCount : ' + hintCount);

//*********************************************************************************

var layerList = [
{
    name: 'osm',
    source: new ol.source.OSM()
},
{
    name: 'watercolor',
    source: new ol.source.Stamen({layer: 'watercolor'})
},
{
    name: 'toner',
    source: new ol.source.Stamen({layer: 'toner'})
},
{
    name: 'terrain',
    source: new ol.source.Stamen({layer: 'terrain'})
},
{
    name: 'aerial',
    source: new ol.source.BingMaps({key: 'AlJ7qM8YoGDlevvCMArmH-dXaNinqfaieYEBhdqpUYCvlIgjRPE7iiGjo-vQ_DJe', imagerySet: 'AerialWithLabelsOnDemand'})
},
{
    name: 'road',
    source: new ol.source.BingMaps({key: 'AlJ7qM8YoGDlevvCMArmH-dXaNinqfaieYEBhdqpUYCvlIgjRPE7iiGjo-vQ_DJe', imagerySet: 'RoadOnDemand'})
},
{
    name: 'dark',
    source: new ol.source.BingMaps({key: 'AlJ7qM8YoGDlevvCMArmH-dXaNinqfaieYEBhdqpUYCvlIgjRPE7iiGjo-vQ_DJe', imagerySet: 'CanvasDark'})
},
{
    name: 'light',
    source: new ol.source.BingMaps({key: 'AlJ7qM8YoGDlevvCMArmH-dXaNinqfaieYEBhdqpUYCvlIgjRPE7iiGjo-vQ_DJe', imagerySet: 'CanvasLight'})
},
{
    name: 'gray',
    source: new ol.source.BingMaps({key: 'AlJ7qM8YoGDlevvCMArmH-dXaNinqfaieYEBhdqpUYCvlIgjRPE7iiGjo-vQ_DJe', imagerySet: 'CanvasGray'})
},
];
var randomLayer = Math.floor(Math.random() * layerList.length);

//*********************************************************************************

var map = new ol.Map({
    target: 'map',
    controls: [],
    interactions: [],
    layers: [

        new ol.layer.Tile({
            source: layerList[randomLayer].source
        }), 
        new ol.layer.Tile(
            ((randomLayer == 1) ? {source: new ol.source.Stamen({layer: 'terrain-labels'})} : {}),
        ), 
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([0,20]),
        zoom: 1
    })
});

//*********************************************************************************

map.on('singleclick', function (evt) {

    var clickCoordinate = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');

    var targetDistance = ol.sphere.getDistance(targetCoordinate, clickCoordinate); 
    console.log('targetDistance : ' + targetDistance);

    console.log('distanceRadius : ' + distanceRadius);

    clickArray.push(Array.from(clickCoordinate));
    console.log('clickArray : ' + clickArray);

    if (targetDistance <= 1000) {

        var clearLayers = map.getLayers().getArray();
        for (var k=clearLayers.length; k>=0; k--) {
            if (clearLayers[k] instanceof ol.layer.Vector) {
                map.removeLayer( clearLayers[k] );
            }
        }

        var targetFeature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat(targetCoordinate)), 

        })

        targetFeature.setStyle(
            new ol.style.Style({
                image: new ol.style.RegularShape({
                    fill: new ol.style.Fill({color: 'rgba(255,215, 0, 0.75)'}),
                    stroke: new ol.style.Stroke({color: 'yellow', width: 4}),
                    points: 5,
                    radius: 24,
                    radius2: 12,
                    angle: 0
                })
            })
            );

        var targetMarker = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [
                targetFeature
                ]
            })
        });
        map.addLayer(targetMarker);

        document.getElementById("popup").style.visibility = "visible";
        document.getElementById("popup-content").innerHTML = targetTitle;

        var popup = new ol.Overlay({
            element: document.getElementById('popup'),
            offset: [0, -20]
        });
        popup.setPosition(ol.proj.fromLonLat(targetCoordinate));
        map.addOverlay(popup);

        var rotationView = map.getView().getRotation();
        var centerView = map.getView().getCenter();
        map.getView().animate(
        {
            center: [
            centerView[0] + (ol.proj.fromLonLat(targetCoordinate)[0] - centerView[0]) / 2,
            centerView[1] + (ol.proj.fromLonLat(targetCoordinate)[1] - centerView[1]) / 2,
            ],
            rotation: Math.PI,
            easing: ol.easing.easeIn,
        },
        {
            center: ol.proj.fromLonLat(targetCoordinate),
            rotation: 2 * Math.PI,
            easing: ol.easing.easeOut,
        },
        {
            zoom: 16,
            duration: 2000
        }
        );

        $('.hilite').removeClass('hilite');
        $('.redacted').removeClass('redacted');

        $('#share').removeClass('d-none');

    }
    else {

        var drawCircle = false;
        var drawError = false;

        clickDistance = targetDistance * 3;
        if (clickDistance >  distanceRadius) { clickDistance = distanceRadius };

        var clickCircle = new ol.geom.Circle(ol.proj.fromLonLat(clickCoordinate), clickDistance);

        var intersectsTarget = clickCircle.intersectsCoordinate(ol.proj.fromLonLat(targetCoordinate));
        console.log('intersectsTarget : ' + intersectsTarget);

        var circleColor = 'red';
        var circleFill = 'rgba(255, 0, 0, 0.5)';

        if (intersectsTarget) {
            circleColor = 'green';
            circleFill = 'rgba(0, 255, 0, 0.1)';

            drawCircle = true;

            distanceRadius = clickDistance/4;
            maxRadius = clickDistance/2;

            roundLevel++;

            map.getView().fit(clickCircle, {size: map.getSize(), duration: 3000 });

            smallestCircle = clickCircle;
        }
        else {

            distanceRadius = distanceRadius * 1.25;

            if (distanceRadius > maxRadius) { 
                distanceRadius = maxRadius;
            }

            var intersectsSmallest;
            console.log('intersectsSmallest : ' + intersectsSmallest);
            console.log('smallestCircle : ' + smallestCircle);

            if (smallestCircle) {
                intersectsSmallest = smallestCircle.intersectsCoordinate(ol.proj.fromLonLat(clickCoordinate));
                console.log('intersectsSmallest : ' + intersectsSmallest);
            }

            if ((intersectsSmallest) || (!smallestCircle)) {

                var intersectsAnyRed = false; 
                for (var j=0; j<redCircleArray.length; j++) {

                    var intersectsRedCircle = redCircleArray[j].intersectsCoordinate(ol.proj.fromLonLat(clickCoordinate));

                    if (intersectsRedCircle) {
                        intersectsAnyRed = true;
                        break;
                    }
                }

                if (intersectsAnyRed) {
                    drawError = "Clicked inside of a red circle";
                }
                else {
                    drawCircle = true;
                }

            }
            else {
                drawError = "Clicked outside of smallest green circle";
            }

        }

        if (drawCircle) {

            var layer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    projection: 'EPSG:4326',
                    features: [new ol.Feature(clickCircle)]
                }),
                style: [
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: circleColor,
                        width: 3
                    }),
                    fill: new ol.style.Fill({
                        color: circleFill
                    })
                })
                ]
            });
            map.addLayer(layer);

            areaScanned += Math.PI * (clickDistance * clickDistance);
            console.log('areaScanned : ' + areaScanned);

            trackArray.push([roundLevel, intersectsTarget, targetDistance]);

            if (previousCoordinate) {
                distanceTraveled += ol.sphere.getDistance(previousCoordinate, clickCoordinate); 
            }
            console.log('distanceTraveled : ' + distanceTraveled);
            previousCoordinate = clickCoordinate;

            if (!intersectsTarget) {
                redCircleArray.push(clickCircle);


                if (hintCount > 0) {
                    hintCount--;
                    $('.hilite').removeClass('hilite');
                    $('#hint-'+ hintCount).removeClass('redacted');
                    $('#hint-'+ hintCount).addClass('hilite');

                }


            }
        }
        else {
            window.alert("drawError : "+ drawError);
        }
    }
});

//*********************************************************************************

var greenEmoji = "&#x1F7E2;";
var redEmoji = "&#x1F534;";
var starEmoji = "&#x2B50;";

function getShare(){

    console.log('trackArray : ' + trackArray );

    var shareHTML = "";
    var shareText = "";

    shareText += 'WORLDle\n';

    for (var i=0; i < trackArray.length; i++) {

        if (trackArray[i][1]) {
            shareHTML += greenEmoji;
            shareText += '🟢';
        }
        else {
            shareHTML += redEmoji;
            shareText += '🔴';
        }

    }

    shareHTML += starEmoji;
    shareText += '⭐';

    shareText += '\nDistance Traveled = '+ Number(distanceTraveled/1000).toLocaleString() +' km';

    shareText += '\nArea Scanned = '+ Number(areaScanned/1000/1000).toLocaleString() +' km²';

    shareText += '\nhttps://www.WORLDle.world';

    shareCopyText(shareText);
}

function fallbackCopyTextToClipboard(stext) {
    var textArea = document.createElement("textarea");
    textArea.value = stext;

    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

function copyTextToClipboard(stext) {
    if (!navigator.clipboard) {
        console.log('does not support navigator.clipboard');
        fallbackCopyTextToClipboard(stext);
        return;
    }
    navigator.clipboard.writeText(stext).then(function() {
        console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
}

function shareCopyText(stext) {
    if (!navigator.share) {
        console.log('does not support navigator.share');
        copyTextToClipboard(stext);
        return;
    }
    navigator.share({
        title: 'WORLDle',
        text: stext,
    })
    .then(() => console.log('Successful share! 🎉'))
    .catch(err => console.error(err));
}

//*********************************************************************************
