export const particlesConfig = {
  "particles": {
    "number": {
      "value": 20
    },
    "color": {
      "value": "#607d8b"
    },
    "size": {
      "value": 2
    },
    "line_linked": {
      "enable": true,
      "distance": 350,
      "color": "#607d8b"
    }
  },
  "interactivity": {
    "events": {
      "onhover": {
        "enable": true,
        "mode": "grab"
      },
      "onclick": {
        "enable": false
      }
    },
    "modes": {
      "grab": {
        "distance": 500,
        "line_linked": {
          "opacity": 1
        }
      }
    }
  }
};


export const botListFeatures = [
  "Coin Price Select",
  "Limits Select",
  "Chart Limits Select",
  "Download CSV",
];

export const botLabFeature = [
  "Seasoning Price",
  "Custom settings",
  "Subscription",
  "More charts",
];

export const tooltips = {
  help: "- With interval = '1d' (daily) and limit = 100: You'll see the last 100 days of price data\n" +
    "- With interval = '1h' (hourly) and limit = 100: You'll see the last 100 hours of price data\n" +
    "- With interval = '15m' (15 minutes) and limit = 100: You'll see the last 100 15-minute periods\n",
}
