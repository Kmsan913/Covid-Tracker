

window.onload = () => {
    getCountryData();
    getHistoricalData();
    getWorldCoronaData();
}


var map;
var infoWindow;
let coronaGlobalData;;
let mapCircles = [];
var casesTypeColors = {
    cases: '#A80006',
    active: '#5F0407',
    recovered: '#CC070E',
    deaths: '#FF0F18'
}
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 39.8283, lng: -98.5795},
        zoom: 3,
        styles: mapStyle
    });
    infoWindow = new google.maps.InfoWindow();
}

const changeDataSelection = (casesType) => {
    clearTheMap();
    showDataOnMap(coronaGlobalData, casesType);
}

const clearTheMap = () => {
    for(let circle of mapCircles){
        circle.setMap(null);
    }
}

const getCountryData = () => {
    fetch("https://corona.lmao.ninja/v2/countries")
    .then((response)=>{
        return response.json()
    }).then((data)=>{
        coronaGlobalData = data;
        showDataOnMap(data);
        //showDataInTable(data);
    })
}


const getWorldCoronaData = () => {
    fetch("https://disease.sh/v2/all")
    .then((response)=>{
        return response.json()
    }).then((data)=>{
        buildPieChart(data);
        updateDataOnButtons(data);
    })
}

const getHistoricalData = () => {
    fetch("https://corona.lmao.ninja/v2/historical/all?lastdays=120")
    .then((response)=>{
        return response.json()
    }).then((data)=>{
        let chartData = buildChartData(data);
        buildChart(chartData);
    })
}

const openInfoWindow = () => {
    infoWindow.open(map);
}

const showDataOnMap = (data, casesType="cases") => {

    data.map((country)=>{
        let countryCenter = {
            lat: country.countryInfo.lat,
            lng: country.countryInfo.long
        }

        var countryCircle = new google.maps.Circle({
            strokeColor: casesTypeColors[casesType],
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: casesTypeColors[casesType],
            fillOpacity: 0.35,
            map: map,
            center: countryCenter,
            radius: country[casesType]
        });

        mapCircles.push(countryCircle);

        var html = `
            <div class="info-container">
                <div class="info-flag" style="background-image: url(${country.countryInfo.flag});">
                </div>
                <div class="info-name">
                    ${country.country}
                </div>
                <div class="info-confirmed">
                    Total: ${numeral(country.cases).format('0,0')}
                </div>
                <div class="info-recovered">
                    Recovered: ${numeral(country.recovered).format('0,0')}
                </div>
                <div class="info-deaths">   
                    Deaths: ${numeral(country.deaths).format('0,0')}
                </div>
            </div>
        `

        var infoWindow = new google.maps.InfoWindow({
            content: html,
            position: countryCircle.center
        });
        google.maps.event.addListener(countryCircle, 'mouseover', function() {
            infoWindow.open(map);
        });

        google.maps.event.addListener(countryCircle, 'mouseout', function(){
            infoWindow.close();
        })

    })

}

updateDataOnButtons = (data) =>{ 

    document.getElementById("total-num").innerHTML = `<h3>
    +${numeral(data.todayCases).format('0.0a')}
    </h3>
    <h6>
    ${numeral(data.cases).format('0.0a')}
    </h6>`;
    document.getElementById("active-number").innerHTML = `<h3>
    +${numeral(data.todayCases).format('0.0a')}
    </h3>
    <h6>
    ${numeral(data.active).format('0.0a')}
    </h6>`;
    document.getElementById("recovered-number").innerHTML = `<h3>
    +${numeral(data.todayRecovered).format('0.0a')}
    </h3>
    <h6>
    ${numeral(data.recovered).format('0.0a')}
    </h6>`;
    document.getElementById("deaths-number").innerHTML = `<h3>
    +${numeral(data.todayDeaths).format('0.0a')}
    </h3>
    <h6>
    ${numeral(data.deaths).format('0.0a')}
    </h6>`;
}

searchCountry = () =>{
    var countryInput = document.getElementById("country-input").value;
    if(countryInput){
        var found = coronaGlobalData.find(c => c.country.toLowerCase() == countryInput.toLowerCase());
        if (found != undefined){
            showDataInTable(found);
            let foundChartdata = buildChartData(found);
            buildChart(foundChartdata);
        }
        else {
            alert("Error. Cannot retrive information on " + countryInput +".");
        }
        }//if
       else{
           console.log("error")
        }//else
 }

 const showDataInTable = (data) => {
    var html = '';
        html += `
        <tr>
            <td>${data.country}</td>
            <td>${numeral(data.cases).format('0,0')}</td>
            <td>${numeral(data.recovered).format('0,0')}</td>
            <td>${numeral(data.recovered).format('0,0')}</td>
        </tr>
        `
    document.getElementById('table-data').innerHTML = html;
}