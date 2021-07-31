/*
    Data:
    budgets: []
*/

export const getMonthString = num => {
  switch (num) {
    case 1:
      return "Jan";
    case 2:
      return "Feb";
    case 3:
      return "Mar";
    case 4:
      return "Apr";
    case 5:
      return "May";
    case 6:
      return "Jun";
    case 7:
      return "Jul";
    case 8:
      return "Aug";
    case 9:
      return "Sep";
    case 10:
      return "Oct";
    case 11:
      return "Nov";
    case 12:
      return "Dec";
    default:
      return "Jan";
  }
};

export const createBudgetsChart = ({ budgets }) => {
  let date = new Date();
  if (!budgets) budgets = [20000, 20000, 23000, 30002, 23000, 30002];

  budgets.reverse();

  let compiled = budgets.map((b, key) => ({
    x: new Date(date.setMonth(date.getUTCMonth() - key)),
    y: b,
  }));

  return {
    theme: "light2",
    backgroundColor: "#ffffff00",
    cornerRadius: "7px",
    animationEnabled: true,
    title: {
      text: "Budget Flow Over Time",
    },
    subtitles: [
      {
        text: "Take a look at how you're doing!",
      },
    ],
    axisY: {
      title: "Budget",
      titleFontColor: "#51CDA0",
      lineColor: "#6D78AD",
      labelFontColor: "#51CDA0",
      tickColor: "#51CDA0",
    },
    toolTip: {
      shared: true,
    },
    legend: {
      cursor: "pointer",
      itemclick: () => {},
    },
    data: [
      {
        type: "spline",
        name: "Budget",
        showInLegend: true,
        xValueFormatString: "MMM YYYY",
        yValueFormatString: "$#,##0 USD",
        dataPoints: compiled,
      },
    ],
  };
};
