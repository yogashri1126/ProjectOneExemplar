var ctx = document.getElementById('myChart').getContext('2d');
var ctxnum = document.getElementById('myChartnumArticle').getContext('2d');

function populateChart (label, value) {
  console.log(label,value);
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: label,
      datasets: [{
        label: "Articel Time",
        data: value,
        backgroundColor: [
          'rgba(255, 99, 132, 1.0)',
          'rgba(54, 162, 235, 1.0)',
          'rgba(255, 206, 86, 1.0)',
          'rgba(75, 192, 192, 1.0)',
          'rgba(153, 102, 255, 1.0)',
          'rgba(255, 159, 64, 1.0)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            maxTicksLimit: 20,
            beginAtZero: true,
            fontSize: 8,
            fontColor: '#666'

          }
        }]
      }
    }
  });
}

function populateChartnumArticle (label, value) {
  console.log(label,value);
  var myChart = new Chart(ctxnum, {
    type: 'bar',
    data: {
      labels: label,
      datasets: [{
        label: "Number of Articles",
        data: value,
        backgroundColor: [
          'rgba(255, 99, 132, 1.0)',
          'rgba(54, 162, 235, 1.0)',
          'rgba(255, 206, 86, 1.0)',
          'rgba(75, 192, 192, 1.0)',
          'rgba(153, 102, 255, 1.0)',
          'rgba(255, 159, 64, 1.0)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            maxTicksLimit: 20,
            beginAtZero: true,
            fontSize: 8,
            fontColor: '#666'

          }
        }]
      }
    }
  });
}


firebase.database().ref('/users').on('value', function (data) {
  var keyz = firebase.auth().currentUser.uid;
  var dat = data.val();
  console.log(dat[keyz]);
  // array of all keys - users
  // selecting logged in user key
  var searchTerm = {};

  var label = [];
  var value = [];
  var valuenum = [];

  //loop through all keys and assign the value to time read
  for (key in dat[keyz].papers) {
    // searchTerm[key] = dat[keyz].papers[key].timeRead;
    var num = 0;
    label.push(key);
    value.push(dat[keyz].papers[key].timeRead);
    for (var i in dat[keyz]["papers"][key]){
        if (dat[keyz]["papers"][key].hasOwnProperty(i)) {
            num++;
        }
    }
    valuenum.push(num-1);
  }
  console.log(label);
  console.log(value);
  console.log(valuenum);

  populateChart(label, value);
  populateChartnumArticle(label, valuenum);
  // console.log('chart',dat[keyz].papers);
  // populateChart()
});
